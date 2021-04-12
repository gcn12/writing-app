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
    const [locationSearch, setLocationSearch] = useState('')
    const [locationTarget, setLocationTarget] = useState()
    const [locationIndex, setLocationIndex] = useState(0)
    const [locationPosition, setLocationPosition] = useState({top: '-9999px', left: '-9999px', display: 'none',})


    const [target, setTarget] = useState()
    const [index, setIndex] = useState(0)
    const [position, setPosition] = useState({top: '-9999px', left: '-9999px', display: 'none',})
    const [searchType, setSearchType] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const searchMap = {
        names: NAMES,
        times: TIME_OF_DAY,
    }

    const locations = LOCATIONS.filter(location=> {
        return location.startsWith(locationSearch.trim().toUpperCase()) && location!==locationSearch.trim().toUpperCase()
    })

    const searchResults = searchMap[searchType]?.filter(item=> {
        return item.startsWith(searchQuery.toUpperCase()) && item!==searchQuery.toUpperCase()
    })

    useEffect(() => {
        if(editor.selection) {
            const { path } = editor.selection.focus
            if (target && (searchType==='names' || searchType==='times') && searchResults.length > 0 && value[path[0]]?.children[0]?.text.length > 0) {
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
    }, [searchResults?.length, searchType, editor.selection, index, searchQuery, searchQuery.length, target])

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
                setIndex(index === 0 ? searchResults.length - 1 : index - 1)
                return true
            }
            if(e.key==='ArrowDown') {
                e.preventDefault()
                setIndex(index === searchResults.length - 1 ? 0 : index + 1)
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
                setIndex(index === 0 ? searchResults.length - 1 : index - 1)
            }
            if(e.key==='ArrowDown') {
                e.preventDefault()
                setIndex(index === searchResults.length - 1 ? 0 : index + 1)
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
            const currentText = value[path[0]].children[path[1]].text
            const intExt = currentText.split(' ')[0].toUpperCase() 
            setLocationIndex(0)
            const [endPosition] = Range.edges(editor.selection)
            let offset = 0
            if(intExt=== 'INT.' || intExt === 'EXT.') offset = 5
            if(intExt=== 'INT./EXT.') offset = 10
            const startPosition = { offset, path }
            const range = Editor.range(editor, startPosition, endPosition)
            this.insertText(locations[locationIndex], range)
            if(!currentText.includes('-')) {
                this.insertText(' - ')
            }
            setLocationSearch('')
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
        replaceCharacter(path) {
            this.insertText(searchResults[index], [path[0]])
            if(value[path[0]].type==='character') {
                this.insertNodes('dialog')
            }else{
                editor.insertBreak()
            }
        },
        replaceTime() {
            const [endPosition] = Range.edges(editor.selection)
            const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
            const range =  Editor.range(editor, startPosition, endPosition)
            this.insertText(searchResults[index], range)
            this.insertNodes(null)
            return this.insertNodes(null)
        },
        handleReplace(path, e, type) {
            if(searchResults?.length > 0 && searchType.length > 0 && searchQuery.length>0) {
                e.preventDefault()
                setSearchQuery('')
                setIndex(0)
                if(searchType==='names') return functions.replaceCharacter(path)
                return functions.replaceTime()
            } else if (e.key==='Enter' && type === 'character') {
                e.preventDefault()
                return this.insertNodes('dialog')
            } else if (e.key==='Enter' && type === 'heading') {
                e.preventDefault()
                this.insertNodes(null)
                return this.insertNodes(null)
            }

            if(locations.length > 0 && locationSearch.length>0) {
                e.preventDefault()
                return functions.replaceLocation(path)
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
        if(searchQuery.length > 0 && searchType==='names' && searchResults.length > 0) {
            if(functions.incrementNameIndex(e)) return
        }
        if(locationSearch && locations.length > 0) {
            if(functions.incrementLocationIndex(e)) return
        }
        if(searchQuery && searchType==='times' && searchResults.length > 0) {
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
            {/* {console.log(value)} */}
            <Slate value={value} editor={editor} onChange={newValue => {
                setValue(newValue)
                if(editor.selection) {
                    const { path } = editor.selection.focus
                    const currentText = newValue[path[0]]?.children[path[1]]?.text

                    if((currentText?.length > 0 || newValue[path[0]].type === 'character') && currentText===currentText.toUpperCase() && !currentText?.includes('INT.') && !currentText?.includes('EXT.') && !currentText?.includes('INT./EXT.')) {
                        setSearchType('names')
                        setSearchQuery(newValue[path[0]].children[0].text)
                        const [endPosition] = Range.edges(editor.selection)
                        const startPosition = Editor.before(editor, endPosition, { unit: 'word' })
                        const range = Editor.range(editor, startPosition, endPosition)
                        setTarget(range)
                    }else if(newValue[path[0]].type === 'heading') {
                        const splitValue = currentText?.split(' ')
                        const currentOffset = editor.selection.anchor.offset
                        const startValue = splitValue.shift()
                        const joinedValue = splitValue.join(' ')
                        let minOffset = startValue.length
                        let maxOffset = Infinity
                        if(joinedValue.includes('-')){
                            const splitDash = joinedValue.split('-')
                            maxOffset = currentText.length - splitDash.length - 4
                        }
                        if(currentOffset > minOffset && currentOffset < maxOffset) {
                            setLocationSearch(joinedValue.split('-')[0])
                            const [endPosition] = Range.edges(editor.selection)
                            let offset = 0
                            const intExt = startValue.toUpperCase()
                            if(intExt=== 'INT.' || intExt === 'EXT.') offset = 4
                            if(intExt=== 'INT./EXT.') offset = 9
                            const startPosition = { offset, path }
                            const range = Editor.range(editor, startPosition, endPosition)
                            setLocationTarget(range)
                        } else if (currentText?.includes('-')) {
                            setSearchType('times')
                            setSearchQuery('')
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
                    }else{
                        setTarget(null)
                        setSearchType('')
                        setLocationSearch('')
                        setLocationTarget(null)
                    }

                    // const splitValue = currentText?.split(' ')
                    // if(newValue[path[0]].type === 'heading') {
                    //     const currentOffset = editor.selection.anchor.offset
                    //     const startValue = splitValue.shift()
                    //     const joinedValue = splitValue.join(' ')
                    //     let minOffset = startValue.length
                    //     let maxOffset = Infinity
                    //     if(joinedValue.includes('-')){
                    //         const splitDash = joinedValue.split('-')
                    //         maxOffset = currentText.length - splitDash.length - 4
                    //     }
                    //     if(currentOffset > minOffset && currentOffset < maxOffset) {
                    //         setLocationSearch(joinedValue.split('-')[0])
                    //         const [endPosition] = Range.edges(editor.selection)
                    //         let offset = 0
                    //         const intExt = startValue.toUpperCase()
                    //         if(intExt=== 'INT.' || intExt === 'EXT.') offset = 4
                    //         if(intExt=== 'INT./EXT.') offset = 9
                    //         const startPosition = { offset, path }
                    //         const range = Editor.range(editor, startPosition, endPosition)
                    //         setLocationTarget(range)
                    //     }
                    // }else{
                    //     setLocationSearch('')
                    //     setLocationTarget(null)
                    // }
                }
            }}>
                {console.log(editor.selection)}
                <Editable style={{boxShadow: 'none'}} autoFocus placeholder='Masterpiece goes here' onKeyDown={modifiers} renderElement={renderElement} />
                {((searchQuery.length > 1 && searchType==='names') || (searchQuery.length > 0 && searchType==='names' && value[editor?.selection?.focus?.path[0]]?.type==='character')) &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
                {locationSearch.length > 0 && locations.length> 0 &&
                <Autocomplete position={locationPosition} items={locations} index={locationIndex} />
                }
                {searchQuery.length > 0 && searchType==='times' && searchResults.length> 0 &&
                <Autocomplete position={position} items={searchResults} index={index} />
                }
            </Slate>
        </Container>
    )
}

export default EditorInterface