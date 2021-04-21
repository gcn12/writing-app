// @refresh reset
import { createEditor, Editor, Transforms, Range } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useMemo, useState, useCallback, useEffect } from 'react'
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
    Parenthetical
} from './EditorAssets'

const EditorInterface = (props) => {
    const editor = useMemo(()=> withReact(createEditor()), [])
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

    const functions = {
        checkTransition(e, currentText) {
            if(e.code==='Semicolon' 
            && e.shiftKey
            && currentText === currentText.toUpperCase()
            ) {
                this.setNode('transition')
                return true
            }
            return false
        },
        checkDescription(path, e, currentText) {
            const previousText = props.value[path[0]-1].children[path[1]].text 
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
                this.setNode(null)
                return true
            }
            return false
        },
        checkDialog(path) {
            const previousText = props.value[path[0]-1].children[path[1]].text
            const previousType = props.value[path[0]-1].type
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
                this.setNode('dialog')
                return true
            }else if(previousText[0] === '(' || previousType==='character') {
                this.setNode('dialog')
                return true
            }
            return false
        },
        checkParenthetical(path, currentText, e) {
            const character = props.value[path[0]-1].children[path[1]].text
            if(character === character.toUpperCase() 
            && (currentText[0] === '(' || (e.key==='(' && e.shiftKey))
            ) {
                this.setNode('parenthetical')
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
        },
        checkCharacter(path, currentText, currentType) {
            if(path[0] > 1) {
                const previousType = props.value[path[0]-2].type
                if(
                    previousType === 'dialog' 
                    && currentType
                    && currentText === currentText.toUpperCase()
                    && !currentText.includes('INT.')
                    && !currentText.includes('EXT.')
                    && !currentText.includes('INT./EXT.')
                ) {
                    this.setNode('character')
                    return true
                }
            }
            return false
        },
        incrementIndex(e) {
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
        },
        timeSearch(newValue) {
            const { path } = editor.selection.focus
            const currentText = newValue[path[0]].children[0].text
            if(!currentText.includes('-')) return
            const splitValue = currentText.split('-')
            if(splitValue.length > 1) {
                setSearchQuery((splitValue[splitValue.length - 1]).trim())
            }
        },
        insertNodes(type) {
            const obj = {children: [{ text: '' }]}
            if(type) obj['type'] = type
            Transforms.insertNodes(editor, [obj])  
        },
        replaceLocation(path) {
            const currentText = props.value[path[0]].children[path[1]].text
            const intExt = currentText.split(' ')[0].toUpperCase() 
            const [endPosition] = Range.edges(editor.selection)
            let offset = 0
            if(intExt=== 'INT.' || intExt === 'EXT.') offset = 5
            if(intExt=== 'INT./EXT.') offset = 10
            const startPosition = { offset, path }
            const range = Editor.range(editor, startPosition, endPosition)
            this.insertText(searchResults[index], range)
            if(!currentText.includes('-')) {
                this.insertText(' - ')
            }
            setIndex(0)
            setSearchQuery('')
        },
        handleDelete(path, e, type) {
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
            return this.setNode(null)
        },
        handleEnter(path, e, type) {
            if(type === 'transition') {
                editor.insertBreak()
                return this.setNode(null)
            }
            if(!type && props.value[path[0]].children[0].text !== props.value[path[0]].children[0].text.toUpperCase()) {
                editor.insertBreak()
            }
            if(type === 'dialog') {
                e.preventDefault()
                this.insertNodes(null)
                if(props.value[path[0]-1].type==='parenthetical') {
                    props.addCharacter(props.value[path[0]-2].children[0].text)
                }else{
                    props.addCharacter(props.value[path[0]-1].children[0].text)
                }
                this.insertNodes('character')
            }
            if(type === 'parenthetical') {
                e.preventDefault()
                return this.insertNodes('dialog')
            }
            return this.handleReplace(path, e, type)
        }, 
        setNode(newType) {
            return Transforms.setNodes(
                editor,
                { type: newType },
                { match: n => Editor.isBlock(editor, n) },
            )
        },
        insertText(text, position) {
            Transforms.insertText(
                editor,
                text, 
                { at: position }
            )
        },
        replaceCharacter(path) {
            this.insertText(searchResults[index].toUpperCase(), [path[0]])
            props.addCharacter(searchResults[index])
            if(props.value[path[0]].type==='character') {
                this.insertNodes('dialog')
            }else{
                editor.insertBreak()
            }
        },
        replaceTime(path) {
            const [endPosition] = Range.edges(editor.selection)
            const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
            const range =  Editor.range(editor, startPosition, endPosition)
            const heading = props.value[path[0]].children[0].text
            this.insertText(heading.toUpperCase(), [path[0]])
            this.insertText(searchResults[index], range)
            props.addLocation(heading)
            this.insertNodes(null)
            return this.insertNodes(null)
        },
        handleReplace(path, e, type) {
            if(searchResults?.length > 0 && searchType.length > 0 && searchQuery.length>0) {
                e.preventDefault()
                setSearchQuery('')
                setIndex(0)
                if(searchType==='names') return functions.replaceCharacter(path)
                if(searchType==='locations') return functions.replaceLocation(path)
                return functions.replaceTime(path)
            } else if (e.key==='Enter' && type === 'character') {
                e.preventDefault()
                const character = props.value[path[0]].children[0].text
                this.insertText(character.toUpperCase(), [path[0]])
                props.addCharacter(character)
                return this.insertNodes('dialog')
            } else if (e.key==='Enter' && type === 'heading') {
                e.preventDefault()
                const heading = props.value[path[0]].children[0].text
                this.insertText(heading.toUpperCase(), [path[0]])
                props.addLocation(heading)
                this.insertNodes(null)
                return this.insertNodes(null)
            }
        },

        checkHeading(splitText) {
            const intExt = splitText[0].toUpperCase()
            if(intExt === 'INT.' || intExt === 'EXT.' || intExt === 'INT./EXT.') {
                this.setNode('heading')
                return true
            }
            return false
        },
    }

    const modifiers = (e) => {
        if(isHotKey('mod+c', e)) return
        if(isHotKey('mod+v', e)) return
        if(isHotKey('mod+x', e)) return
        if(isHotKey('mod', e)) return

        
        if(props.isPreventSave) props.setIsPreventSave(false)
        if(!editor.selection) return
        if(searchQuery.length > 0 && searchType.length > 0 && searchResults.length > 0) {
            if(functions.incrementIndex(e)) return
        }
        const { path } = editor.selection.focus
        const { type } = props.value[path[0]]
        const currentText = props.value[path[0]].children[0].text
        const splitText = currentText.split(' ')
        if (e.key==='Backspace') return functions.handleDelete(path, e, type)
        if (e.key === 'Enter') return functions.handleEnter(path, e, type)
        if (e.key === 'Tab') return functions.handleReplace(path, e, type)
        if (functions.checkTransition(e, currentText)) return
        if (functions.checkHeading(splitText)) return
        if(path[0] > 1) {
            if (functions.checkDescription(path, e, currentText)) return
        }
        if (functions.checkCharacter(path, currentText, type)) return
        if(path[0] > 0) {
            if (functions.checkParenthetical(path, currentText, e)) return
            if (functions.checkDialog(path)) return
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
        functions.timeSearch(newValue)
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

        if((currentText?.length > 0 || newValue[path[0]].type === 'character') && currentText===currentText.toUpperCase() && !currentText?.includes('INT.') && !currentText?.includes('EXT.') && !currentText?.includes('INT./EXT.')) {
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

    return(
        <Container>
            <Slate value={props.value} editor={editor} onChange={newValue => {
                props.setValue(newValue)
                if(editor.selection) {
                    handleOnChange(newValue)
                }
            }}>
                <StyledEditable autoFocus placeholder='Masterpiece goes here' onKeyDown={modifiers} renderElement={renderElement} />
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