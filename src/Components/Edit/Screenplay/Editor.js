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
        checkHeading(path) {
            const splitHeading = value[path[0]].children[0].text.split(' ')
            const intExt = splitHeading[0].toUpperCase()
            if(intExt === 'INT.' || intExt === 'EXT.' || intExt === 'INT./EXT.') {
                Transforms.setNodes(
                    editor, 
                    {type: 'heading'},
                    { match: n => Editor.isBlock(editor, n) }
                )
            }
        },
        checkTransition(path, e) {
            if(e.code==='Semicolon' && e.shiftKey) {
                const transition = value[path[0]].children[0].text
                const transitionText = transition.slice(0, transition.length-1)
                if(transitionText === transitionText.toUpperCase()){
                    Transforms.setNodes(
                        editor,
                        { type: 'transition' },
                        { match: n => Editor.isBlock(editor, n) },
                    )
                }
            }
        },
        checkDescription(path, e) {
            if(path[0] > 0) {
                if(value[path[0]-1].children[path[1]].text === '' && e.key !== 'Enter' && !value[path[0]].children[path[1]].text.toUpperCase().includes('INT.')){
                    Transforms.setNodes(
                        editor,
                        { type: null },
                        { match: n => Editor.isBlock(editor, n) },
                    )
                }
            }
        },
        checkDialog(path) {
            if(path[0] > 0) {
                const previousLine = value[path[0]-1].children[path[1]].text
                const previousType = value[path[0]-1].type
                const changeType = () => Transforms.setNodes(
                    editor,
                    { type: 'dialog' },
                    { match: n => Editor.isBlock(editor, n) },
                ) 
                if(
                    previousLine === previousLine.toUpperCase() 
                    && previousLine.length > 0
                    && previousLine[previousLine.length - 1] !== ':'
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
                    changeType()
                }else if(previousLine[0] === '(') {
                    changeType()
                }else if(previousType==='character') {
                    changeType()
                }
            }
        },
        checkParenthetical(path) {
            if(path[0] > 0) {
                const character = value[path[0]-1].children[path[1]].text
                const currentText = value[path[0]].children[path[1]].text
                if(character === character.toUpperCase() && currentText[0] === '(') {
                    Transforms.setNodes(
                        editor,
                        { type: 'parenthetical' },
                        { match: n => Editor.isBlock(editor, n) },
                    )
                    Transforms.setNodes(
                        editor,
                        { type: 'character' },
                        { 
                            at: [path[0]-1],
                            match: n => Editor.isBlock(editor, n),
                            mode: 'lowest',
                        },
                    )
                }
            }
        },
        checkCharacter(path) {
            if(path[0] > 1) {
                const previousType = value[path[0]-2].type
                const currentType = value[path[0]].type
                const currentText = value[path[0]].children[path[1]].text
                if(
                    previousType === 'dialog' 
                    && currentText === currentText.toUpperCase()
                    && !currentText.includes('INT.')
                    && !currentText.includes('EXT.')
                    && !currentText.includes('INT./EXT.')
                    && currentType
                ) {
                    Transforms.setNodes(
                        editor,
                        { type: 'character' },
                        { match: n => Editor.isBlock(editor, n) },
                    )
                }
            }
        },
        deleteReset(path, e) {
            const currentText = value[path[0]].children[path[1]].text
            if(currentText === '' && value[path[0]].type) {
                e.preventDefault()
                Transforms.setNodes(
                    editor, 
                    { type: null },
                    { match: n => Editor.isBlock(editor, n) },
                )
            }  
        },
        incrementNameIndex(e) {
            if(e.key==='ArrowUp') {
                e.preventDefault()
                setNameIndex(nameIndex === 0 ? names.length - 1 : nameIndex - 1)
            }
            if(e.key==='ArrowDown') {
                e.preventDefault()
                setNameIndex(nameIndex === names.length - 1 ? 0 : nameIndex + 1)
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
            Transforms.insertText(
                editor,
                names[nameIndex],
                { at: [path[0]] },
            )
            if(value[path[0]].type==='character') {
                Transforms.insertNodes(
                    editor,
                    [{ type: 'dialog', children: [{ text: '' }] }]
                    )
            }else{
                editor.insertBreak()
            }
        },
        replaceLocation(path) {
            const intExt = value[path[0]].children[path[1]].text.split(' ')[0].toUpperCase() 
            setLocationIndex(0)
            const [start] = Range.edges(editor.selection)
            // const wordBefore = Editor.before(editor, start, { unit: 'word' })
            let offset = 0
            if(intExt=== 'INT.' || intExt === 'EXT.') offset = 5
            if(intExt=== 'INT./EXT.') offset = 10
            const wordBefore = { offset, path }
            const beforeRange = wordBefore && Editor.range(editor, wordBefore, start)
            Transforms.insertText(
                editor,
                locations[locationIndex],
                { at: beforeRange },
            )
            setLocationSearch('')
        },
        replaceTime() {
            setTimeSearch('')
            setTimeIndex(0)
            const [start] = Range.edges(editor.selection)
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const beforeRange = wordBefore && Editor.range(editor, wordBefore, start)
            Transforms.insertText(
                editor,
                times[timeIndex],
                { at: beforeRange },
            )
            editor.insertBreak()
            editor.insertBreak()
        },
    }

    const modifiers = (e) => {
        if(!editor.selection) return
        const { path } = editor.selection.focus
        const { type } = value[path[0]]
        functions.checkDescription(path, e)
        functions.checkTransition(path, e)
        functions.checkDialog(path)
        functions.checkCharacter(path)
        functions.checkParenthetical(path)
        functions.checkHeading(path)
        if(e.key==='Backspace') functions.deleteReset(path, e)
        if(e.key === 'Enter' && (type === 'dialog')) {
            editor.insertBreak()
            Transforms.setNodes(
                editor,
                { type: 'character' },
                { match: n => Editor.isBlock(editor, n) },
            )
        }
        if(e.key === 'Enter' && (type === 'transition')) {
            editor.insertBreak()
            Transforms.setNodes(
                editor,
                { type: 'heading' },
                { match: n => Editor.isBlock(editor, n) },
            )
        }
        if(e.key==='Enter' || e.key==='Tab') {
            if(names.length > 0 && nameSearch.length>0) {
                e.preventDefault()
                functions.replaceCharacter(path)
            }else if (e.key==='Enter' && (type === 'character')) {
                e.preventDefault()
                Transforms.insertNodes(
                    editor,
                    [{ type: 'dialog', children: [{ text: '' }] }]
                )
            }
            if(locations.length > 0 && locationSearch.length>0) {
                e.preventDefault()
                functions.replaceLocation(path)
            }
            if(times.length > 0 && timeSearch.length>0) {
                e.preventDefault()
                functions.replaceTime()
            }
        }
        if(nameSearch && names.length > 0) {
            functions.incrementNameIndex(e)
        }
        if(locationSearch && locations.length > 0) {
            functions.incrementLocationIndex(e)
        }
        if(timeSearch && times.length > 0) {
            functions.incrementTimeIndex(e)
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
                        const [start] = Range.edges(editor.selection)
                        const wordBefore = Editor.before(editor, start, { unit: 'word' })
                        const beforeRange = wordBefore && Editor.range(editor, wordBefore, start)
                        setNameTarget(beforeRange)
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
                                const [start] = Range.edges(editor.selection)
                                let offset = 0
                                const intExt = value[path[0]].children[path[1]].text.split(' ')[0].toUpperCase()
                                if(intExt=== 'INT.' || intExt === 'EXT.') offset = 4
                                if(intExt=== 'INT./EXT.') offset = 9
                                const wordBefore = { offset, path }
                                // const wordBefore = Editor.before(editor, start, { unit: 'word' })
                                const beforeRange = wordBefore && Editor.range(editor, wordBefore, start)
                                setLocationTarget(beforeRange)
                            }else{
                                setLocationTarget(null)
                            }
                        }
                    }else{
                        setLocationSearch('')
                    }

                    functions.timeSearch(newValue)
                    if (currentText?.length > 0) {
                        const splitText = currentText.split('-')
                        splitText.pop()
                        const joinedText = splitText.join('')
                        let offset = joinedText.length + 1
                        const [start] = Range.edges(editor.selection)
                        // const wordBefore = Editor.before(editor, start, { unit: 'word' })
                        const wordBefore = { path, offset }
                        const beforeRange = wordBefore && Editor.range(editor, wordBefore, start)
                        setTimeTarget(beforeRange)
                    }else{
                        setTimeTarget(null)
                    }
                }
            }}>
                <Editable style={{boxShadow: 'none'}} autoFocus placeholder='Masterpiece goes here' onKeyDown={modifiers} renderElement={renderElement} />
                {/* {nameSearch.length > 1 && */}
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