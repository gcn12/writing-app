// @refresh reset
import { createEditor, Editor, Transforms, Range, Text } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { withHistory } from 'slate-history'
import { connect } from 'react-redux'
import Autocomplete from './Autocomplete'
import styled from 'styled-components'
import isHotKey from 'is-hotkey'
import {
    TIME_OF_DAY,
    Container,
    Dialog,
    SceneHeading,
    Paragraph,
    Transition,
    Character,
    Parenthetical,
    Decorations
} from './EditorAssets'

const EditorInterface = (props) => {
    const editor = useMemo(()=> withReact(withHistory(createEditor())), [])
    const [target, setTarget] = useState()
    const [index, setIndex] = useState(0)
    const [position, setPosition] = useState({top: '-9999px', left: '-9999px', display: 'none',})
    const [searchType, setSearchType] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const searchMap = {
        names: props.characters,
        times: TIME_OF_DAY,
        locations: props.locations,
    }

    const searchResults = searchMap[searchType]?.filter(item=> {
        return item.startsWith(searchQuery.toUpperCase()) && item!==searchQuery.toUpperCase()
    })

    useEffect(() => {
        if(editor.selection) {
            const { path } = editor.selection.focus
            const currentText = props.value[path[0]]?.children[0]?.text
            if (target && searchType.length > 0 && searchResults?.length > 0 && currentText?.length > 0) {
                const domRange = ReactEditor.toDOMRange(editor, target)
                const rect = domRange.getBoundingClientRect()
                const newPosition = {
                    top: `${rect.top + window.pageYOffset + 25}px`,
                    display: 'flex',
                }
                if(searchType==='locations' || 'times') {
                    newPosition['left'] = `${rect.left + window.pageXOffset + 10}px`
                }
                if(searchType==='names'){
                    newPosition['left'] = `${rect.left + window.pageXOffset}px`
                }
                setPosition(newPosition)
            }else{
                setPosition({
                    top: '-9999px',
                    left: '-9999px',
                    display: 'none'
                })
            }
        }
        // eslint-disable-next-line 
    }, [searchResults?.length, index, searchType, editor, searchQuery, target])
    
    const renderElement = useCallback((props)=> {
        const { type } = props.element
        if(type==='character') return <Character {...props} />
        if(type==='dialog') return <Dialog {...props} />
        if(type==='heading') return <SceneHeading {...props} />
        if(type==='transition') return <Transition {...props} />
        if(type==='parenthetical') return <Parenthetical {...props} />
        return <Paragraph {...props} />
    }, [])

    const checkDescription = (path, e, currentText, type) => {
        if(!type) return false
        const previousText = props.value[path[0]-1].children[0].text 
        const previousPreviousType = props.value[path[0]-2].type
        const currentTextUppercase = currentText.toUpperCase()
        let nextType
        if(props.value[path[0]+1]) {
            nextType = props.value[path[0]+1].type
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

    const checkDialog = (path, type) => {
        if(type==='dialog') return false
        const currentText = props.value[path[0]].children[0].text
        const previousText = props.value[path[0]-1].children[0].text
        const previousType = props.value[path[0]-1].type
        if(
            previousText === previousText.toUpperCase() 
            && previousText.length > 0
            && previousText[previousText.length - 1] !== ':'
            && currentText[currentText.length - 1] !== ':'
            && currentText[0] !== '('
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
            Transforms.setNodes(
                editor, 
                {preventStyle: true},  
                {at: [path[0]-1], match: n => Text.isText(n), split: true}

            )
            
            setNode('dialog')
            return true
        }else if(previousText.length > 0 && (currentText[0] !== '(') && (previousText[0] === '(' || previousType==='character')) {
            setNode('dialog')
            return true
        }
        return false
    }

    const checkParenthetical = (path, currentText, e, type) => {
        if (type==='parenthetical') return false
        const character = props.value[path[0]-1].children[0].text
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
        if (currentType==='character') return false
        if(path[0] > 1) {
            const previousType = props.value[path[0]-2].type
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
        let obj = {children: [{ text: '' }]}
        if(type) obj['type'] = type
        if(type===null || type === 'dialog') {
            Transforms.insertNodes(editor, [obj])  
        }else {
            Transforms.insertNodes(editor, [obj])  
            Transforms.setNodes(
                editor, 
                {preventStyle: true},  
                {match: n => Text.isText(n), split: true}
            )
        }
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

    const replaceLocationAddDash = (path) => {
        const currentText = props.value[path[0]].children[path[1]].text
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
        const currentText = props.value[path[0]].children[path[1]].text
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
        if(newType===null || newType === 'dialog') {
            Transforms.setNodes(
                editor, 
                {preventStyle: false},  
                {match: n => Text.isText(n), split: true}
            )
            return Transforms.setNodes(
                editor,
                { type: newType },
                { match: n => Editor.isBlock(editor, n) },
            )
        }else {
            Transforms.setNodes(
                editor, 
                {preventStyle: true},  
                {match: n => Text.isText(n), split: true}
            )
            return Transforms.setNodes(
                editor,
                { type: newType },
                { match: n => Editor.isBlock(editor, n) },
            )
        }
    }

    const replaceCharacter = (path) => {
        insertText(searchResults[index].toUpperCase(), [path[0]])
        props.addCharacter(searchResults[index])
    }

    const replaceCharacterEnter = (path) => {
        replaceCharacter(path)
        if(props.value[path[0]].type==='character') {
            return insertNodes('dialog')
        }
        return editor.insertBreak()
    }

    const replaceTime = (path) => {
        const [endPosition] = Range.edges(editor.selection)
        const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
        const range =  Editor.range(editor, startPosition, endPosition)
        const heading = props.value[path[0]].children[0].text
        insertText(heading.toUpperCase(), [path[0]])
        insertText(searchResults[index], range)
        return props.addLocation(heading)
    }

    const replaceTimeEnter = (path) => {
        replaceTime(path)
        insertNodes(null)
        return insertNodes(null)
    }

    const checkTransition = (e, currentText, type) => {
        if(type==='transition') return false
        if(
            e.code==='Semicolon' 
            && e.shiftKey
            && currentText === currentText.toUpperCase()
        ) {
            setNode('transition')
            return true
        }
        if(
            currentText === currentText.toUpperCase()
            && currentText.includes('(')
        ) {
            setNode('transition')
            return true
        }
        return false
    }

    const checkHeading = (splitText, type) => {
        if(type==='heading') return false
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
            if(searchType==='locations') return replaceLocationAddDash(path)
            return replaceTimeEnter(path)
        } else if (type === 'character') {
            e.preventDefault()
            const character = props.value[path[0]].children[0].text
            insertText(character.toUpperCase(), [path[0]])
            props.addCharacter(character)
            return insertNodes('dialog')
        } else if (type === 'heading') {
            e.preventDefault()
            const heading = props.value[path[0]].children[0].text
            insertText(heading.toUpperCase(), [path[0]])
            props.addLocation(heading)
            insertNodes(null)
            return insertNodes(null)
        }
    }

    const handleEnter = (path, e, type) => {
        if(type === 'transition') {
            editor.insertBreak()
            return setNode(null)
        }
        if(!type && props.value[path[0]].children[0].text !== props.value[path[0]].children[0].text.toUpperCase()) {
            return editor.insertBreak()
        }
        if(type === 'dialog') {
            e.preventDefault()
            insertNodes(null)
            if(props.value[path[0]-1].type==='parenthetical') {
                props.addCharacter(props.value[path[0]-2].children[0].text)
            }else{
                props.addCharacter(props.value[path[0]-1].children[0].text)
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
            if(searchType==='locations') return replaceLocationAddDash(path)
            return replaceTime(path)
        } 
    }

    const pasteCheckHeading = (text) => {
        const split = text.split(' ')
        if(
            split[0].toUpperCase().includes('INT.')
            || split[0].toUpperCase().includes('EXT.')
            || split[0].toUpperCase().includes('INT./EXT.')
        ) return true
        return false
    }

    const pasteCheckCharacter = (text, next) => {
        if(!next) return false
        if(next.length === 0) return false
        if(text.toUpperCase() !== text) return false
        return true
    }

    const pasteCheckTransition = (text) => {
        if(
            text.toUpperCase() === text
            && text.includes(':')
        ) return true
        return false
    }

    const checkPasteParenthetical = (current, previous) => {
        if(!previous) return false
        if(!previous.length > 0) return false
        if(current.trim()[0] !== '(') return false
        return true
    }

    const pasteCheckDialog = (current, previous, next) => {
        if(!previous) return false
        if(previous.length === 0) return false
        if(previous.toUpperCase()!==previous) return true
        if(previous[0] !== '(') return true
        return false
    }

    const pasteText = (text, type, currentIndex, maxIndex) => {
        Transforms.setNodes(editor, {type})
        Transforms.insertText(editor, text)
        if(currentIndex !== maxIndex - 1) return insertNodes(null)
    }

    const checkPaste = (current, previous, next, currentIndex, maxIndex) => {
        if(pasteCheckHeading(current)===true) return pasteText(current, 'heading', currentIndex, maxIndex)
        if(pasteCheckTransition(current)) return pasteText(current, 'transition', currentIndex, maxIndex)
        if(pasteCheckCharacter(current, next)) return pasteText(current, 'character', currentIndex, maxIndex)
        if(checkPasteParenthetical(current, previous)) return pasteText(current, 'parenthetical', currentIndex, maxIndex)
        if(pasteCheckDialog(current, previous)) return pasteText(current, 'dialog', currentIndex, maxIndex)
        return pasteText(current, null)
    }

    editor.insertData = (data) => {
        const currentText = data.getData('text/plain')
        const splitText = currentText.split('\n')
        for (let i = 0; i < splitText.length; i ++) {
            const current = splitText[i]
            let previous
            let next
            if(i - 1 >= 0) previous = splitText[i - 1]
            if(i + 1 < splitText.length) next = splitText[i + 1]
            checkPaste(current, previous, next, i, splitText.length)
        }
    }

    const handleUndo = () => {
        setTarget(null)
    }

    const checkIsPreventStyle = () => {
        const [match] = Editor.nodes(editor, {
            match: n => n.preventStyle === true
        })
        return match
    }

    const modifiers = (e) => {
        const { path } = editor.selection.focus
        const { type } = props.value[path[0]]
        if(e.key==='h' && e.ctrlKey) {
            setNode('character')
            insertNodes(null)
            insertNodes(null)
        }
        if(e.key==='a' && e.ctrlKey) {
            setNode(null)
        }
        if(e.key==='ArrowRight') return
        if(e.key==='ArrowLeft') return
        if(e.key==='ArrowUp' && searchQuery.length===0) return
        if(e.key==='ArrowDown' && searchQuery.length===0) return
        
        if(isHotKey('mod+b', e)) {
            e.preventDefault()
            if(checkIsPreventStyle()) return
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
        if(isHotKey('mod+v', e)) return 
        if(isHotKey('mod+x', e)) return
        if(isHotKey('mod+z+shift', e)) return handleUndo()
        if(isHotKey('mod+z', e)) return handleUndo()
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
        const currentText = props.value[path[0]].children[0].text
        const splitText = currentText.split(' ')
        if (e.key==='Backspace') return handleDelete(path, e, type)
        if (e.key === 'Enter') return handleEnter(path, e, type)
        if (e.key === 'Tab') return handleTab(path, e, type)
        if (checkTransition(e, currentText, type)) return
        if (checkHeading(splitText, type)) return
        if(path[0] > 1) {
            checkDescription(path, e, currentText, type)
        }
        if (checkCharacter(path, currentText, type)) return
        if(path[0] > 0) {
            if (checkParenthetical(path, currentText, e, type)) return
            if (checkDialog(path, type)) return
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

    const Leaf = (props) => {
        let weight 
        if(props.leaf.bold) {
            weight = 600
        }else if(props?.children?.props?.parent?.type==='heading') { 
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
            {/* {console.log(props.value)} */}
            <Slate value={props.value} editor={editor} onChange={newValue => {
                props.setValue(newValue)
                if(editor.selection) {
                    handleOnChange(newValue)
                }
            }}>
                <StyledEditable renderLeaf={renderLeaf} autoFocus placeholder='Masterpiece goes here' onKeyDown={modifiers} renderElement={renderElement} />
                {((searchQuery.length > 1 && searchType==='names') || (searchQuery.length > 0 && searchType==='names' && props.value[editor?.selection?.focus?.path[0]]?.type==='character')) &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
                {searchQuery.length > 0 && searchType==='locations' && searchResults?.length> 0 &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
                {searchQuery.length > 0 && searchType==='times' && searchResults.length> 0 &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
            </Slate>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(EditorInterface)

const StyledEditable = styled(Editable)`
    &:focus{
        box-shadow: none;
    }
`