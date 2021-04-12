import styled from 'styled-components'
import { connect } from 'react-redux'
import { useState } from 'react'
import EditorInterface from './Editor'

const Screenplay = (props) => {

    const [savingStatus, setSavingStatus] = useState('All changes saved')
    const [characters, setCharacters] = useState([])
    const [charactersObj, setCharactersObj] = useState({})
    const [locations, setLocations] = useState([])
    const [locationsObj, setLocationsObj] = useState({})

    const getCharacters = (scriptObject) => {
        const characters = {}
        scriptObject.forEach(item=> {
            if(item?.type === 'character') {
                const name = item.children[0].text.toUpperCase()
                if(characters[name]) {
                    characters[name] += 1
                } else{
                    characters[name] = 1
                }
            }
        })
        setCharactersObj(characters)
        const charactersArray =  Object.entries(characters)
        charactersArray.sort((a, b)=> b[1] - a[1])
        const charactersFinal = charactersArray.map(item=> {
            return item[0]
        }) 
        setCharacters(charactersFinal)
    }

    const addCharacter = (characterName) => {
        const charactersCopy = {...charactersObj}
        const characterUppercase = characterName.toUpperCase()
        if(characters[characterUppercase]) {
            characters[characterUppercase] += 1
        }else{
            characters[characterUppercase] = 1
        }
        setCharactersObj(charactersCopy)
        const charactersArray =  Object.entries(characters)
        charactersArray.sort((a, b)=> b[1] - a[1])
        const charactersFinal = charactersArray.map(item=> {
            return item[0]
        }) 
        setCharacters(charactersFinal)
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
                    if(locations[location]) {
                        locations[location] += 1
                    } else{
                        locations[location] = 1
                    }
                } 
            }
        })
        setLocationsObj(locations)
        const locationsArray =  Object.entries(locations)
        locationsArray.sort((a, b)=> b[1] - a[1])
        const locationsFinal = locationsArray.map(item=> {
            return item[0]
        }) 
        setLocations(locationsFinal)
    }

    const addLocation = (heading) => {
        const locationsCopy = {...locationsObj}
        const splitHeading = heading.split(' ')
        if(splitHeading.length > 1) {
            splitHeading.shift()
            const joined = splitHeading.join(' ')
            const splitDash = joined.split('-')
            splitDash.pop()
            splitDash.join('')
            const location = splitDash[0].trim().toUpperCase()
            if(locationsCopy[location]) {
                locationsCopy[location] += 1
            } else{
                locationsCopy[location] = 1
            }
            setLocationsObj(locationsCopy)
            const locationsArray = Object.entries(locationsCopy)
            locationsArray.sort((a, b)=> b[1] - a[1])
            const locationsFinal = locationsArray.map(item=> {
                return item[0]
            }) 
            setLocations(locationsFinal)
        } 
    }

    const updateSavingStatus = (status) => {
        setSavingStatus(status)
    }

    return(
        <Container>
            {savingStatus}
            <EditorInterface locations={locations} addLocation={addLocation} getLocations={getLocations} characters={characters} addCharacter={addCharacter} match={props.match} getCharacters={getCharacters} updateSavingStatus={updateSavingStatus} />
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(Screenplay)

export const Container = styled.div`
`