import styled from 'styled-components'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import firebase from 'firebase'
import EditorInterface from './Editor'
import Toolbar from './Toolbar'
import moment from 'moment'

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
        getScript()
        // eslint-disable-next-line
    }, [])

    const getScript = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then(data=> {
            const scriptData = data.data()
            const script = scriptData.text
            document.title = scriptData.name
            setScriptID(data.data().docID)
            if(script.length > 0) {
                setValue(script)
                getCharacters(script)
                getLocations(script)
                setCurrentWords(getWords(script))
            }
        })
    }

    window.onbeforeunload = function() {
        if(savingStatus==='Saving...') {
            return 'saving'
        }
    }

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

    const getWords = (script) => {
        let words = 0
        script.forEach(item=> {
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
        updateWordCount()
        saveScriptToDatabase(scriptObject, userID, scriptID)
        updateLastUpdated(currentTime)
        setLastSaved(currentTime)
    }

    const updateWordCount = () => {
        const newWordCount = getWords(value)
        const change = newWordCount - currentWords
        setCurrentWords(newWordCount)
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
        const date = moment().format('L')
        db.collection('users')
        .doc(props.userData.userID)
        .collection('goals')
        .doc('daily-goal')
        .update({
            'wordsWritten.words': wordsToAdd,
            'wordsWritten.date': date
        })
    }

    const getCharacterCount = (scriptObject) => {
        const charactersObject = {}
        scriptObject.forEach(item=> {
            if(item?.type !== 'character') return
            const name = item.children[0].text.toUpperCase()
            const nameNoParentheses = removeParenthesesFromCharacter(name)
            incrementItem(nameNoParentheses, charactersObject)
        })
        return charactersObject
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
        if(itemName.length===0) return
        if(itemCount[itemName]) {
            return itemCount[itemName] += 1
        }else{
            return itemCount[itemName] = 1
        }
    }

    const removeParenthesesFromCharacter = (characterName) => {
        if(characterName.includes('(')) {
            const split = characterName.split('(')
            split.pop()
            console.log(split)
            return split.join('').trim()
        }
        return characterName
    }

    const addCharacter = (characterName) => {
        const characterUppercase = characterName.toUpperCase()
        const characterNoParentheses = removeParenthesesFromCharacter(characterUppercase)
        const characterCopy = {...charactersObj}
        incrementItem(characterNoParentheses, characterCopy)
        setCharactersObj(characterCopy)
        const charactersArray =  Object.entries(characterCopy)
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
        const locationsCopy = {...locationsObj}
        if(splitHeading.length < 2) return
        splitHeading.shift()
        const joined = splitHeading.join(' ')
        const splitDash = joined.split('-')
        splitDash.pop()
        splitDash.join('')
        const location = splitDash[0].trim().toUpperCase()
        incrementItem(location, locationsCopy)
        setLocationsObj(locationsCopy)
        console.log(locationsCopy)
        const locationsArray = Object.entries(locationsCopy)
        const locationsList = sortArray(locationsArray)
        setLocations(locationsList)
    }


    const updateSavingStatus = (status) => {
        setSavingStatus(status)
    }

    return(
        <Container>
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