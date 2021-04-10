// @refresh reset
import { createEditor, Editor, Transforms, Range } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { useMemo, useState, useCallback, useEffect } from 'react'
import Autocomplete from './Autocomplete'
import {
    NAMES,
    LOCATIONS,
    TIME_OF_DAY,
    Container,
    Dialog,
    SceneHeading,
    Paragraph,
    Transition,
    Character,
    Parenthetical
} from './EditorAssets'

const EditorInterface = () => {

    const editor = useMemo(()=> withReact(createEditor()), [])
    const [value, setValue] = useState([{type: 'paragraph', children: [{text: ''}]}])
    const [nameSearch, setNameSearch] = useState('')
    const [nameTarget, setNameTarget] = useState()
    const [nameIndex, setNameIndex] = useState(0)
    const [namePosition, setNamePosition] = useState({top: '-9999px', left: '-9999px', display: 'none',})
    const [locationSearch, setLocationSearch] = useState('')
    const [locationTarget, setLocationTarget] = useState()
    const [locationIndex, setLocationIndex] = useState(0)
    const [locationPosition, setLocationPosition] = useState({top: '-9999px', left: '-9999px', display: 'none',})
    const [timeSearch, setTimeSearch] = useState('')
    const [timeTarget, setTimeTarget] = useState()
    const [timeIndex, setTimeIndex] = useState(0)
    const [timePosition, setTimePosition] = useState({top: '-9999px', left: '-9999px', display: 'none'})

    const names = NAMES.filter(name=> {
        return name.startsWith(nameSearch) && name!==nameSearch
    })

    const locations = LOCATIONS.filter(location=> {
        return location.startsWith(locationSearch.trim().toUpperCase()) && location!==locationSearch.trim().toUpperCase()
    })

    const times = TIME_OF_DAY.filter(time=> {
        return time.startsWith(timeSearch.toUpperCase()) && time!==timeSearch.toUpperCase()
    })

    useEffect(() => {
        if(editor.selection) {
            const { path } = editor.selection.focus
            if (nameTarget && names.length > 0 && value[path[0]]?.children[0]?.text.length > 0) {
                const domRange = ReactEditor.toDOMRange(editor, nameTarget)
                const rect = domRange.getBoundingClientRect()
                setNamePosition({
                    top: `${rect.top + window.pageYOffset + 25}px`,
                    left: `${rect.left + window.pageXOffset}px`,
                    display: 'flex',
                })
            }else{
                setNamePosition({
                    top: '-9999px',
                    left: '-9999px',
                    display: 'none'
                })
            }
        }
        // eslint-disable-next-line 
    }, [names.length, editor.selection, nameIndex, nameSearch, nameSearch.length, nameTarget])

    useEffect(() => {
        if (locationTarget && locations.length > 0) {
            const domRange = ReactEditor.toDOMRange(editor, locationTarget)
            const rect = domRange.getBoundingClientRect()
            setLocationPosition({
                top: `${rect.top + window.pageYOffset + 25}px`,
                left: `${rect.left + window.pageXOffset}px`, 
                display: 'flex',
            })
        }else{
            setLocationPosition({
                top: '-9999px',
                left: '-9999px',
                display: 'none',
            })
        }
        // eslint-disable-next-line 
    }, [locations.length, editor.selection, locationIndex, locationSearch, locationTarget])

    useEffect(() => {
        if (timeTarget && times.length > 0) {
            const domRange = ReactEditor.toDOMRange(editor, timeTarget)
            const rect = domRange.getBoundingClientRect()
            setTimePosition({
                top: `${rect.top + window.pageYOffset + 25}px`,
                left: `${rect.left + window.pageXOffset}px`,
                display: 'flex'
            })
        }else{
            setTimePosition({
                top: '-9999px',
                left: '-9999px',
                display: 'none'
            })
        }
        // eslint-disable-next-line 
    }, [times.length, editor.selection, timeIndex, timeSearch, timeTarget])
    
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
            const previousText = value[path[0]-1].children[path[1]].text 
            const previousPreviousType = value[path[0]-2].type
            const currentTextUppercase = currentText.toUpperCase()
            if(previousText === '' 
                && e.key !== 'Enter'
                && !currentTextUppercase.includes('EXT.')
                && !currentTextUppercase.includes('INT.')
                && !currentTextUppercase.includes('INT./EXT.')
                && previousPreviousType !== 'dialog'
            ) {
                this.setNode(null)
                return true
            }
            return false
        },
        checkDialog(path) {
            const previousText = value[path[0]-1].children[path[1]].text
            const previousType = value[path[0]-1].type
            if(
                previousText === previousText.toUpperCase() 
                && previousText.length > 0
                && previousText[previousText.length - 1] !== ':'
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
            const character = value[path[0]-1].children[path[1]].text
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
                const previousType = value[path[0]-2].type
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
        incrementNameIndex(e) {
            if(e.key==='ArrowUp') {
                e.preventDefault()
                setNameIndex(nameIndex === 0 ? names.length - 1 : nameIndex - 1)
                return true
            }
            if(e.key==='ArrowDown') {
                e.preventDefault()
                setNameIndex(nameIndex === names.length - 1 ? 0 : nameIndex + 1)
                return true
            }
        },
        incrementLocationIndex(e) {
            if(e.key==='ArrowUp') {
                e.preventDefault()
                setLocationIndex(locationIndex === 0 ? locations.length - 1 : locationIndex - 1)
            }
            if(e.key==='ArrowDown') {
                e.preventDefault()
                setLocationIndex(locationIndex === locations.length - 1 ? 0 : locationIndex + 1)
            }
        },
        incrementTimeIndex(e) {
            if(e.key==='ArrowUp') {
                e.preventDefault()
                setTimeIndex(timeIndex === 0 ? times.length - 1 : timeIndex - 1)
            }
            if(e.key==='ArrowDown') {
                e.preventDefault()
                setTimeIndex(timeIndex === times.length - 1 ? 0 : timeIndex + 1)
            }
        },
        timeSearch(newValue) {
            const { path } = editor.selection.focus
            const currentText = newValue[path[0]].children[0].text
            if(!currentText.includes('-')) return
            const splitValue = currentText.split('-')
            if(splitValue.length > 1) {
                setTimeSearch((splitValue[splitValue.length - 1]).trim())
            }
        },
        replaceCharacter(path) {
            setNameIndex(0)
            this.insertText(names[nameIndex], [path[0]])
            if(value[path[0]].type==='character') {
                this.insertNodes('dialog')
            }else{
                editor.insertBreak()
            }
        },
        insertNodes(type) {
            const obj = {
                children: [{ text: '' }]
            }
            if(type) {
                obj['type'] = type
            }
            Transforms.insertNodes(
                editor, 
                [obj]
            )
                
        },
        replaceLocation(path) {
            const intExt = value[path[0]].children[path[1]].text.split(' ')[0].toUpperCase() 
            setLocationIndex(0)
            const [endPosition] = Range.edges(editor.selection)
            let offset = 0
            if(intExt=== 'INT.' || intExt === 'EXT.') offset = 5
            if(intExt=== 'INT./EXT.') offset = 10
            const startPosition = { offset, path }
            const range = Editor.range(editor, startPosition, endPosition)
            this.insertText(locations[locationIndex], range)
            this.insertText(' - ')
            setLocationSearch('')
        },
        replaceTime() {
            setTimeSearch('')
            setTimeIndex(0)
            const [start] = Range.edges(editor.selection)
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const beforeRange = wordBefore && Editor.range(editor, wordBefore, start)
            this.insertText(times[timeIndex], beforeRange)
            this.insertNodes(null)
            return this.insertNodes(null)
        },
        handleDelete(path, e, type) {
            const currentText = value[path[0]].children[path[1]].text
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
            if(!type) {
                editor.insertBreak()
            }
            if(type === 'dialog') {
                e.preventDefault()
                this.insertNodes(null)
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
        handleReplace(path, e, type) {
            if(names.length > 0 && nameSearch.length>0) {
                e.preventDefault()
                return functions.replaceCharacter(path)
            }else if (e.key==='Enter' && (type === 'character')) {
                e.preventDefault()
                return this.insertNodes('dialog')
            }
            if(locations.length > 0 && locationSearch.length>0) {
                e.preventDefault()
                return functions.replaceLocation(path)
            }
            if(times.length > 0 && timeSearch.length>0) {
                e.preventDefault()
                return functions.replaceTime()
            }else if (e.key==='Enter' && (type === 'heading')) {
                e.preventDefault()
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
        if(!editor.selection) return
        if(nameSearch && names.length > 0) {
            if(functions.incrementNameIndex(e)) return
        }
        if(locationSearch && locations.length > 0) {
            if(functions.incrementLocationIndex(e)) return
        }
        if(timeSearch && times.length > 0) {
            if(functions.incrementTimeIndex(e)) return
        }
        const { path } = editor.selection.focus
        const { type } = value[path[0]]
        const currentText = value[path[0]].children[0].text
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

    return(
        <Container>
            {console.log(value)}
            <Slate value={value} editor={editor} onChange={newValue => {
                setValue(newValue)
                if(editor.selection) {
                    const { path } = editor.selection.focus
                    const currentText = newValue[path[0]]?.children[path[1]]?.text

                    setNameSearch(newValue[path[0]].children[0].text)
                    if (currentText?.length > 0 || newValue[path[0]].type === 'character') {
                        const [endPosition] = Range.edges(editor.selection)
                        const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
                        const range = Editor.range(editor, startPosition, endPosition)
                        setNameTarget(range)
                    }else{
                        setNameTarget(null)
                    }

                    if(newValue[path[0]].type === 'heading') {
                        const splitValue = newValue[path[0]].children[0].text.split(' ')
                        if(splitValue.length<2) {
                            setLocationSearch('')
                            setLocationTarget(null)
                        }else{
                            splitValue.shift()
                            const joinedValue = splitValue.join(' ')
                            setLocationSearch(joinedValue)
                            if (currentText?.length > 0) {
                                const [endPosition] = Range.edges(editor.selection)
                                let offset = 0
                                const intExt = value[path[0]].children[path[1]].text.split(' ')[0].toUpperCase()
                                if(intExt=== 'INT.' || intExt === 'EXT.') offset = 4
                                if(intExt=== 'INT./EXT.') offset = 9
                                const startPosition = { offset, path }
                                const range = Editor.range(editor, startPosition, endPosition)
                                setLocationTarget(range)
                            }else{
                                setLocationTarget(null)
                            }
                        }
                    }else{
                        setLocationSearch('')
                    }
                     
                    if(currentText?.includes('-') && newValue[path[0]].type === 'heading') {
                        functions.timeSearch(newValue)
                        const splitText = currentText.split('-')
                        splitText.pop()
                        const joinedText = splitText.join('')
                        let offset = joinedText.length + 1
                        const [endPosition] = Range.edges(editor.selection)
                        const startPosition = { path, offset }
                        const range = Editor.range(editor, startPosition, endPosition)
                        setTimeTarget(range)
                    }else{
                        setTimeSearch('')
                        setTimeTarget(null)
                    }
                }
            }}>
                <Editable style={{boxShadow: 'none'}} autoFocus placeholder='Masterpiece goes here' onKeyDown={modifiers} renderElement={renderElement} />
                {(nameSearch.length > 1 || (nameSearch.length > 0 && value[editor?.selection?.focus?.path[0]]?.type==='character')) &&
                <Autocomplete position={namePosition} items={names} index={nameIndex} />
                }
                {locationSearch.length > 0 && locations.length> 0 &&
                <Autocomplete position={locationPosition} items={locations} index={locationIndex} />
                }
                {timeSearch.length > 0 && times.length> 0 &&
                <Autocomplete position={timePosition} items={times} index={timeIndex} />
                }
            </Slate>
        </Container>
    )
}

export default EditorInterface