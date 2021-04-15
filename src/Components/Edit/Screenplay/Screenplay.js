import styled from 'styled-components'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import firebase from 'firebase'
import EditorInterface from './Editor'
import Toolbar from './Toolbar'

const Screenplay = (props) => {
    const [value, setValue] = useState([{type: 'paragraph', children: [{text: ''}]}])
    const [scriptID, setScriptID] = useState('')
    const [isPreventSave, setIsPreventSave] = useState(true)
    const [currentWords, setCurrentWords] = useState(0)
    const [savingStatus, setSavingStatus] = useState('All changes saved')
    const [characters, setCharacters] = useState([])
    const [charactersObj, setCharactersObj] = useState({})
    const [locations, setLocations] = useState([])
    const [locationsObj, setLocationsObj] = useState({})
    const [lastSaved, setLastSaved] = useState(0)

    useEffect(()=> {
        if(isPreventSave) return
        updateSavingStatus('Saving...')
        const save = setTimeout(()=> saveScript(value, props.userData.userID, props.match.params.fileID), 2000)
        return ()=> clearTimeout(save)
        // eslint-disable-next-line
    }, [value])

    useEffect(()=> {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then(data=> {
            const script = data.data().text
            setScriptID(data.data().docID)
            if(script.length > 0) {
                setValue(script)
                getCharacters(script)
                getLocations(script)
                setCurrentWords(getWords(script))
            }
        })
        // eslint-disable-next-line
    }, [])

    const updateLastUpdatedFunction = (currentTime, collectionName, fileID) => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection(collectionName)
        .doc(fileID)
        .update({
            lastModified: currentTime,
        })
        .then(()=> {
            console.log('updated')
        })
    }

    const updateLastUpdated = (currentTime) => {
        if(currentTime - lastSaved > 600000) {
            updateLastUpdatedFunction(currentTime, 'files-folders', props.match.params.fileID)
            updateLastUpdatedFunction(currentTime, 'files-folders', String(scriptID))
        }
    }

    const getWords = () => {
        let words = 0
        value.forEach(item=> {
            if(item.children[0].text.length===0) return
            let text = item.children[0].text.trim()
            if(item.type==='heading') {
                text = text.split(' -').join('').split(' ')
            }else {
                text = text.split(' ')
            }
            words += text.length
        })
        return words
    }

    const saveScript = (scriptObject, userID, scriptID) => {
        const currentTime = Date.now()
        const newWordCount = getWords(value)
        const change = newWordCount - currentWords
        setCurrentWords(newWordCount)
        saveScriptToDatabase(scriptObject, userID, scriptID)
        updateLastUpdated(currentTime)
        setLastSaved(currentTime)
        if(change > 0) return incrementWordsInDatabase(change)
    }

    const saveScriptToDatabase = (scriptObject, userID, scriptID) => {
        db.collection('users')
        .doc(userID)
        .collection('files')
        .doc(scriptID)
        .update({
            text: scriptObject
        })
        .then(()=> {
            updateSavingStatus('All changes saved')
        })
    }

    const incrementWordsInDatabase = (wordsAdded) => {
        const wordsToAdd = firebase.firestore.FieldValue.increment(wordsAdded)
        db.collection('users')
        .doc(props.userData.userID)
        .collection('statistics')
        .doc('words-written')
        .update({
            today: wordsToAdd,
        })
    }


    const getCharacterCount = (scriptObject) => {
        const characters = {}
        scriptObject.forEach(item=> {
            if(item?.type !== 'character') return
            const name = item.children[0].text.toUpperCase()
            incrementItem(name, characters)
        })
        return characters
    }

    const sortArray = (array) => {
        array.sort((a, b)=> b[1] - a[1])
        return array.map(item=> {
            return item[0]
        }) 
    }

    const getCharacters = (scriptObject) => {
        const characterCount = getCharacterCount(scriptObject)
        setCharactersObj(characterCount)
        const charactersArray =  Object.entries(characterCount)
        const charactersList = sortArray(charactersArray)
        setCharacters(charactersList)
    }

    const incrementItem = (itemName, itemCount) => {
        if(itemCount[itemName]) {
            return itemCount[itemName] += 1
        }else{
            return itemCount[itemName] = 1
        }
    }

    const addCharacter = (characterName) => {
        const characterUppercase = characterName.toUpperCase()
        const characterCount = incrementItem(characterUppercase, {...charactersObj})
        setCharactersObj(characterCount)
        const charactersArray =  Object.entries(characters)
        const charactersList = sortArray(charactersArray)
        setCharacters(charactersList)
    }

    const getLocations = (scriptObject) => {
        const locations = {}
        scriptObject.forEach(item=> {
            if(item?.type === 'heading') {
                const heading = item.children[0].text
                const splitHeading = heading.split(' ')
                if(splitHeading.length > 1) {
                    splitHeading.shift()
                    const joined = splitHeading.join(' ')
                    const splitDash = joined.split('-')
                    splitDash.pop()
                    splitDash.join('')
                    const location = splitDash[0].trim().toUpperCase()
                    incrementItem(location, locations)
                } 
            }
        })
        setLocationsObj(locations)
        const locationsArray =  Object.entries(locations)
        const locationsList = sortArray(locationsArray)
        setLocations(locationsList)
    }

    const addLocation = (heading) => {
        const splitHeading = heading.split(' ')
        if(splitHeading.length < 2) return
        splitHeading.shift()
        const joined = splitHeading.join(' ')
        const splitDash = joined.split('-')
        splitDash.pop()
        splitDash.join('')
        const location = splitDash[0].trim().toUpperCase()
        const incrementedLocations = incrementItem(location, {...locationsObj})
        setLocationsObj(incrementedLocations)
        const locationsArray = Object.entries(incrementedLocations)
        const locationsList = sortArray(locationsArray)
        setLocations(locationsList)
    }


    const updateSavingStatus = (status) => {
        setSavingStatus(status)
    }

    return(
        <Container>
            {/* <button onClick={getWords}>Words</button> */}
            <Toolbar value={value} savingStatus={savingStatus} />
            <InterfaceContainer>
                <EditorInterface isPreventSave={isPreventSave} setIsPreventSave={setIsPreventSave} value={value} setValue={setValue} locations={locations} addLocation={addLocation} getLocations={getLocations} characters={characters} addCharacter={addCharacter} match={props.match} getCharacters={getCharacters} updateSavingStatus={updateSavingStatus} />
            </InterfaceContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(Screenplay)

const InterfaceContainer = styled.div`
    display: grid;
    align-items: center;
    justify-content: center;
`

export const Container = styled.div`
`