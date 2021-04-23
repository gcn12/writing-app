// @refresh reset
import { createEditor, Editor, Transforms, Range, Text } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Autocomplete from '../Edit/Screenplay/Autocomplete'
import isHotKey from 'is-hotkey'
import {
    TIME_OF_DAY,
    Dialog,
    SceneHeading,
    Paragraph,
    Transition,
    Character,
    Parenthetical,
    Decorations
} from '../Edit/Screenplay/EditorAssets'

const EditorPreview = (props) => {
    const [value, setValue] = useState([
        {type: 'heading', children: [{text: 'INT. HOUSE - NIGHT'}]},
        {children: [{text: ''}]},
        {children: [{text: 'Water rushes down the stairs.'}]},
        {children: [{text: ''}]},
        {type: 'character', children: [{text: 'JASMINE'}]},
        {type: 'parenthetical', children: [{text: '(softly)'}]},
        {type: 'dialog', children: [{text: 'What day is it?'}]},
        {children: [{text: ''}]},
        {type: 'transition', children: [{text: 'CUT TO:'}]},
        {children: [{text: ''}]},
        {children: [{text: ''}]},
    ])
    const editor = useMemo(()=> withReact(createEditor()), [])
    const [target, setTarget] = useState()
    const [index, setIndex] = useState(0)
    const [position, setPosition] = useState({top: '-9999px', left: '-9999px', display: 'none',})
    const [searchType, setSearchType] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [characters, setCharacters] = useState(['JASMINE'])
    const [locations, setLocations] = useState(['HOUSE'])
    const [locationsObj, setLocationsObj] = useState({})
    const [charactersObj, setCharactersObj] = useState({})

    const searchMap = {
        names: characters,
        times: TIME_OF_DAY,
        locations: locations,
    }


    const searchResults = searchMap[searchType]?.filter(item=> {
        return item.startsWith(searchQuery.toUpperCase()) && item!==searchQuery.toUpperCase()
    })


    useEffect(() => {
        if(editor.selection) {
            const { path } = editor.selection.focus
            const currentText = value[path[0]]?.children[0]?.text
            if (target && searchType.length > 0 && searchResults?.length > 0 && currentText?.length > 0) {
                const domRange = ReactEditor.toDOMRange(editor, target)
                const rect = domRange.getBoundingClientRect()
                console.log(rect.top, window.pageYOffset)
                setPosition({
                    top: `${rect.top + window.pageYOffset + 25}px`,
                    left: `${rect.left + window.pageXOffset}px`,
                    display: 'flex',
                })
            }else{
                setPosition({
                    top: '-9999px',
                    left: '-9999px',
                    display: 'none'
                })
            }
        }
        // eslint-disable-next-line 
    }, [searchResults?.length, searchType, editor.selection, searchQuery, target])
    
    const renderElement = useCallback((props)=> {
        const { type } = props.element
        if(type==='character') return <Character {...props} />
        if(type==='dialog') return <Dialog {...props} />
        if(type==='heading') return <SceneHeading {...props} />
        if(type==='transition') return <Transition {...props} />
        if(type==='parenthetical') return <Parenthetical {...props} />
        return <Paragraph {...props} />
    }, [])

    const checkTransition = (e, currentText) => {
        if(e.code==='Semicolon' 
        && e.shiftKey
        && currentText === currentText.toUpperCase()
        ) {
            setNode('transition')
            return true
        }
        return false
    }

    const checkDescription = (path, e, currentText) => {
        const previousText = value[path[0]-1].children[0].text 
        const previousPreviousType = value[path[0]-2].type
        const currentTextUppercase = currentText.toUpperCase()
        let nextType
        if(value[path[0]+1]) {
            nextType = value[path[0]+1].type
        }
        if(
            previousText === '' 
            && e.key !== 'Enter'
            && !currentTextUppercase.includes('EXT.')
            && !currentTextUppercase.includes('INT.')
            && !currentTextUppercase.includes('INT./EXT.')
            && previousPreviousType !== 'dialog'
            && nextType !== 'dialog'
        ) {
            setNode(null)
            return true
        }
        return false
    }

    const checkDialog = (path) => {
        const previousText = value[path[0]-1].children[0].text
        const previousType = value[path[0]-1].type
        if(
            previousText === previousText.toUpperCase() 
            && previousText.length > 0
            && previousText[previousText.length - 1] !== ':'
            && !previousText.includes('INT.')
            && !previousText.includes('EXT.')
            && !previousText.includes('INT./EXT.')
        ) {
            Transforms.setNodes(
                editor,
                { type: 'character' },
                { 
                    at: [path[0]-1],
                    match: n => Editor.isBlock(editor, n),
                    mode: 'lowest',
                },
            )
            setNode('dialog')
            return true
        }else if(previousText[0] === '(' || previousType==='character') {
            setNode('dialog')
            return true
        }
        return false
    }

    const checkParenthetical = (path, currentText, e) => {
        const character = value[path[0]-1].children[0].text
        if(character === character.toUpperCase() 
        && (currentText[0] === '(' || (e.key==='(' && e.shiftKey))
        ) {
            setNode('parenthetical')
            Transforms.setNodes(
                editor,
                { type: 'character' },
                { 
                    at: [path[0]-1],
                    match: n => Editor.isBlock(editor, n),
                    mode: 'lowest',
                },
            )
            return true
        }
        return false
    }

    const checkCharacter = (path, currentText, currentType) => {
        if(path[0] > 1) {
            const previousType = value[path[0]-2].type
            if(
                previousType === 'dialog' 
                && currentType
                && currentText === currentText.toUpperCase()
                && !currentText.includes('INT.')
                && !currentText.includes('EXT.')
                && !currentText.includes('INT./EXT.')
                && !currentText.includes(':')
            ) {
                setNode('character')
                return true
            }
        }
        return false
    }

    const incrementIndex = (e) => {
        if(e.key==='ArrowUp') {
            e.preventDefault()
            setIndex(index === 0 ? searchResults.length - 1 : index - 1)
            return true
        }
        if(e.key==='ArrowDown') {
            e.preventDefault()
            setIndex(index === searchResults.length - 1 ? 0 : index + 1)
            return true
        }
    }

    const timeSearch = (newValue) => {
        const { path } = editor.selection.focus
        const currentText = newValue[path[0]].children[0].text
        if(!currentText.includes('-')) return
        const splitValue = currentText.split('-')
        if(splitValue.length > 1) {
            setSearchQuery((splitValue[splitValue.length - 1]).trim())
        }
    }

    const insertNodes = (type) => {
        const obj = {children: [{ text: '' }]}
        if(type) obj['type'] = type
        Transforms.insertNodes(editor, [obj])  
    }

    const replaceLocation = (path, currentText) => {
        const intExt = currentText.split(' ')[0].toUpperCase() 
        const [endPosition] = Range.edges(editor.selection)
        let offset = 0
        if(intExt=== 'INT.' || intExt === 'EXT.') offset = 5
        if(intExt=== 'INT./EXT.') offset = 10
        const startPosition = { offset, path }
        const range = Editor.range(editor, startPosition, endPosition)
        insertText(searchResults[index], range)
        setIndex(0)
        setSearchQuery('')
    }

    const replaceLocationEnter = (path) => {
        const currentText = value[path[0]].children[path[1]].text
        replaceLocation(path, currentText)
        insertNodes(null)
        insertNodes(null)
    }

    const replaceLocationTab = (path) => {
        const currentText = value[path[0]].children[path[1]].text
        replaceLocation(path, currentText)
        if(!currentText.includes('-')) {
            insertText(' - ')
        }
    }

    const handleDelete = (path, e, type) => {
        const anchor = editor.selection.anchor
        const focus = editor.selection.focus
        if(anchor.path[0] !== focus.path[0]) return
        if(anchor.offset !== focus.offset) return
        const currentText = value[path[0]].children[path[1]].text
        if(type==='heading') {
            const split = currentText.split(' ')
            if(split.length === 2 && split[1].trim().length===0) {
                setTarget(null)
            }
            if(anchor.offset===0) return
        }
        if(!type) {
            if(anchor.offset===0) return
        }
        const offset = editor.selection.focus.offset
        if(currentText.length > 0 && offset > 0) return
        if(currentText === '' && (type==='heading' || !type)) return
        
        e.preventDefault()
        return setNode(null)
    }
    const setNode = (newType) => {
        return Transforms.setNodes(
            editor,
            { type: newType },
            { match: n => Editor.isBlock(editor, n) },
        )
    }

    const replaceCharacter = (path) => {
        insertText(searchResults[index].toUpperCase(), [path[0]])
        addCharacter(searchResults[index])
    }

    const replaceCharacterEnter = (path) => {
        replaceCharacter(path)
        if(value[path[0]].type==='character') {
            return insertNodes('dialog')
        }
        return editor.insertBreak()
    }

    const replaceTime = (path) => {
        const [endPosition] = Range.edges(editor.selection)
        const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
        const range =  Editor.range(editor, startPosition, endPosition)
        const heading = value[path[0]].children[0].text
        insertText(heading.toUpperCase(), [path[0]])
        insertText(searchResults[index], range)
        return addLocation(heading)
    }

    const replaceTimeEnter = (path) => {
        replaceTime(path)
        insertNodes(null)
        return insertNodes(null)
    }

    const checkHeading = (splitText) => {
        const intExt = splitText[0].toUpperCase()
        if(intExt === 'INT.' || intExt === 'EXT.' || intExt === 'INT./EXT.') {
            setNode('heading')
            return true
        }
        return false
    }

    const insertText = (text, position) => {
        Transforms.insertText(
            editor,
            text, 
            { at: position }
        )
    }

    const handleReplace = (path, e, type) => {
        if(searchResults?.length > 0 && searchType.length > 0 && searchQuery.length>0) {
            e.preventDefault()
            setSearchQuery('')
            setIndex(0)
            if(searchType==='names') return replaceCharacterEnter(path)
            if(searchType==='locations') return replaceLocationEnter(path)
            return replaceTimeEnter(path)
        } else if (type === 'character') {
            e.preventDefault()
            const character = value[path[0]].children[0].text
            insertText(character.toUpperCase(), [path[0]])
            addCharacter(character)
            return insertNodes('dialog')
        } else if (type === 'heading') {
            e.preventDefault()
            const heading = value[path[0]].children[0].text
            insertText(heading.toUpperCase(), [path[0]])
            addLocation(heading)
            insertNodes(null)
            return insertNodes(null)
        }
    }

    const handleEnter = (path, e, type) => {
        if(value.length >= 20) e.preventDefault()
        if(type === 'transition') {
            editor.insertBreak()
            return setNode(null)
        }
        if(!type && value[path[0]].children[0].text !== value[path[0]].children[0].text.toUpperCase()) {
            return editor.insertBreak()
        }
        if(type === 'dialog') {
            e.preventDefault()
            insertNodes(null)
            if(value[path[0]-1].type==='parenthetical') {
                addCharacter(value[path[0]-2].children[0].text)
            }else{
                addCharacter(value[path[0]-1].children[0].text)
            }
            return insertNodes('character')
        }
        if(type === 'parenthetical') {
            e.preventDefault()
            return insertNodes('dialog')
        }
        return handleReplace(path, e, type)
    }

    const handleTab = (path, e) => {
        if(searchResults?.length > 0 && searchType.length > 0 && searchQuery.length>0) {
            e.preventDefault()
            setSearchQuery('')
            setIndex(0)
            if(searchType==='names') return replaceCharacter(path)
            if(searchType==='locations') return replaceLocationTab(path)
            return replaceTime(path)
        } 
    }

    const modifiers = (e) => {
        // const { path } = editor.selection.focus
        if(isHotKey('mod+b', e)) {
            e.preventDefault()
            const [match] = Editor.nodes(editor, {
                match: n => n.bold === true
            })
            Transforms.setNodes(
                editor, 
                {bold: match ? false : true}, 
                {match: n => Text.isText(n), split: true}
            )
        }
        if(isHotKey('mod+i', e)) {
            e.preventDefault()
            const [match] = Editor.nodes(editor, {
                match: n => n.italics === true
            })
            Transforms.setNodes(
                editor, 
                {italics: match ? false : true}, 
                {match: n => Text.isText(n), split: true}
            )
        }
        if(isHotKey('mod+c', e)) return
        if(isHotKey('mod+v', e)) e.preventDefault()
        if(isHotKey('mod+x', e)) return
        if(isHotKey('mod', e)) return
        const anchor = editor.selection.anchor
        const focus = editor.selection.focus
        if(anchor.path[0] !== focus.path[0]) return
        if(anchor.offset !== focus.offset) return
        
        if(props.isPreventSave) props.setIsPreventSave(false)
        if(!editor.selection) return
        if(searchQuery.length > 0 && searchType.length > 0 && searchResults.length > 0) {
            if(incrementIndex(e)) return
        }
        const { path } = editor.selection.focus
        const { type } = value[path[0]]
        const currentText = value[path[0]].children[0].text
        const splitText = currentText.split(' ')
        if (e.key==='Backspace') return handleDelete(path, e, type)
        if (e.key === 'Enter') return handleEnter(path, e, type)
        // if (e.key === 'Tab') return handleReplace(path, e, type)
        if (e.key === 'Tab') return handleTab(path, e, type)
        if (checkTransition(e, currentText)) return
        if (checkHeading(splitText)) return
        if(path[0] > 1) {
            if (checkDescription(path, e, currentText)) return
        }
        if (checkCharacter(path, currentText, type)) return
        if(path[0] > 0) {
            if (checkParenthetical(path, currentText, e)) return
            if (checkDialog(path)) return
        }
    }

    const namesOnChange = (newValue, path) => {
        setSearchType('names')
        setSearchQuery(newValue[path[0]].children[0].text)
        const [endPosition] = Range.edges(editor.selection)
        const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
        const range = Editor.range(editor, startPosition, endPosition)
        setTarget(range)
    }

    const locationsOnChange = (startValue, joinedValue, path) => {
        setSearchType('locations')
        setSearchQuery(joinedValue.split('-')[0].trim())
        const [endPosition] = Range.edges(editor.selection)
        let offset = 0
        const intExt = startValue.toUpperCase()
        if(intExt=== 'INT.' || intExt === 'EXT.') offset = 4
        if(intExt=== 'INT./EXT.') offset = 9
        const startPosition = { offset, path }
        const range = Editor.range(editor, startPosition, endPosition)
        setTarget(range)
    }

    const timesOnChange = (newValue, currentText, path) => {
        setSearchType('times')
        timeSearch(newValue)
        const splitText = currentText.split('-')
        splitText.pop()
        const joinedText = splitText.join('')
        let offset = joinedText.length + 1
        const [endPosition] = Range.edges(editor.selection)
        const startPosition = { path, offset }
        const range = Editor.range(editor, startPosition, endPosition)
        setTarget(range)
    }

    const handleOnChange = (newValue) => {
        const { path } = editor.selection.focus
        const currentText = newValue[path[0]]?.children[path[1]]?.text

        if((
            currentText?.length > 0 
            && (newValue[path[0]].type === 'character'
            || currentText===currentText.toUpperCase())
            ) 
            && !currentText?.includes('INT.') 
            && !currentText?.includes('EXT.') 
            && !currentText?.includes('INT./EXT.')
        ) {
            namesOnChange(newValue, path)
        }else if(newValue[path[0]].type === 'heading') {
            const currentOffset = editor.selection.anchor.offset
            const splitValue = currentText?.split(' ')
            const startValue = splitValue.shift()
            const joinedValue = splitValue.join(' ')
            const minOffset = startValue.length
            let maxOffset = Infinity
            if(joinedValue.includes('-')){
                const splitDash = joinedValue.split('-')
                maxOffset = currentText.length - splitDash.length - 4
            }
            if(currentOffset > minOffset && currentOffset < maxOffset) {
                locationsOnChange(startValue, joinedValue, path)
            } else if (currentOffset > maxOffset) {
                timesOnChange(newValue, currentText, path)
            }
        }else{
            setTarget(null)
            setSearchType('')
        }
    }

    const sortArray = (array) => {
        array.sort((a, b)=> b[1] - a[1])
        return array.map(item=> {
            return item[0]
        }) 
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
        const locationsArray = Object.entries(locationsCopy)
        const locationsList = sortArray(locationsArray)
        setLocations(locationsList)
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

    const removeParenthesesFromCharacter = (characterName) => {
        if(characterName.includes('(')) {
            const split = characterName.split('(')
            split.pop()
            return split.join('').trim()
        }
        return characterName
    }

    const incrementItem = (itemName, itemCount) => {
        if(itemName.length===0) return
        if(itemCount[itemName]) {
            return itemCount[itemName] += 1
        }else{
            return itemCount[itemName] = 1
        }
    }

    const Leaf = (props) => {
        let weight 
        if(props.leaf.bold) {
            weight = 600
        }else if(props.children.props.parent.type==='heading') { 
            weight = 600
        } else {
            weight = 500
        }
        return(
            <Decorations {...props.attributes}
                weight={weight}
                italics={props.leaf.italics ? 'italic' : 'normal'}
            >
                {props.children}
            </Decorations>
        )
    }

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return(
        <Container>
            <StyledSlate value={value} editor={editor} onChange={newValue => {
                setValue(newValue)
                if(editor.selection) {
                    handleOnChange(newValue)
                }
            }}>
                <StyledEditable renderLeaf={renderLeaf} placeholder='Try it out here' onKeyDown={modifiers} renderElement={renderElement} />
                {((searchQuery.length > 1 && searchType==='names') || (searchQuery.length > 0 && searchType==='names' && value[editor?.selection?.focus?.path[0]]?.type==='character')) &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
                {searchQuery.length > 0 && searchType==='locations' && searchResults?.length> 0 &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
                {searchQuery.length > 0 && searchType==='times' && searchResults.length> 0 &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
            </StyledSlate>
        </Container>
    )
}

export default EditorPreview

const StyledSlate = styled(Slate)`
`

const Container = styled.div`
    font-family: 'Courier New', Courier, monospace;
    width: 100%;
    /* height: 100%; */
    background-color: white;
    padding: 50px 60px 50px 60px;
    border-radius: 5px;
    min-height: 20vh;
    margin: 45px 0;
    z-index: 1;
    box-shadow: 2px 5px 7px rgba(0, 0, 0, .2);
    @media(max-width: 650px) {
        /* width: 95vw; */
        padding: 40px 40px 50px 40px;
    }
`

const StyledEditable = styled(Editable)`
    &:focus{
        box-shadow: none;
    }
`