import styled from 'styled-components'
import { jsPDF } from 'jspdf'
import '../../../CourierPrime-Regular-normal'
import '../../../CourierPrime-Bold-normal'
import '../../../CourierPrime-BoldItalic-bolditalic'
import '../../../CourierPrime-Italic-italic'

const CreatePDFButton = (props) => {
    let line = 1
    let newPage = 56
    let currentPage = '2'

    const createPage = () => {
        return new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [8.5, 11]
        })
    }
    
    const selectFont = (wordItem) => {
        if(wordItem.bold && wordItem.italics) return ['CourierPrime-BoldItalic', 'bolditalic']
        if(wordItem.bold) return ['CourierPrime-Bold', 'normal']
        if(wordItem.italics) return ['CourierPrime-Italic', 'italic']
        return ['CourierPrime-Regular', 'normal']
    }

    const insertPageBreak = (script, currentPage) => {
        script.addPage()
        script.text(currentPage + '.', script.internal.pageSize.width - 1, .5)
    }

    const decrementLine = () => {
        newPage -= 1
        line+= .16
    }

    const addNewPage = (script) => {
        insertPageBreak(script, currentPage)
        currentPage = String(Number(currentPage) + 1)
        line = 1
        newPage = 56
    }

    const assignWords = (item) => {
        if(item.children.length > 1) return Object.values(item.children)
        if(item.children.length === 1) return item.children[0].text
    }

    const addTransiton = (script, words) => {
        const stringWidth = script.getTextWidth(words)
        script.text(words.toUpperCase(), script.internal.pageSize.width - 1 - stringWidth, line)
        return decrementLine()
    }
    
    const addCharacter = (script, words) => {
        script.text(words.toUpperCase(), 3.7, line)
    }

    const addParenthetical = (script, words) => {
        const lineWrap = script.splitTextToSize(words, 2)
        lineWrap.forEach(item=> {
            return script.text(item, 3.1, line)
        })
    }

    const addHeading = (script, text, index, words) => {
        script.setFont('CourierPrime-Bold', 'normal')
        if(text[index-1] && text[index-1].children[0].text.length===0) {
            decrementLine()
        }
        script.text(words.toUpperCase(), 1.5, line)
    }

    const addDialog = (script, words) => {
        let maxLineLength = 3.3
        let lineLength = 0
        const addDialog = (words) => {
            words.forEach(word=> {
                const wordLength = script.getTextWidth(word)
                if(maxLineLength - wordLength < 0) {
                    decrementLine()
                    maxLineLength = 3.3
                    lineLength = 0
                }
                script.text(word, 2.5 + lineLength, line)
                maxLineLength -= (wordLength + .1)
                lineLength += (wordLength + .1)
            })
        }
        if(Array.isArray(words)){
            words.forEach(wordItem=> {
                script.setFont(...selectFont(wordItem))
                const splitWords = wordItem.text.trim().split(' ')
                addDialog(splitWords)
            })
        }else {
            const splitWords = words.trim().split(' ')
            addDialog(splitWords)
        }
        if(newPage <= 0) addNewPage(script)
    }

    const addDescription = (script, words) => {
        let lineLengthMax = 6
        let lineLength = 0
        const addDescriptionWords = (words) => {
            words.forEach(word => {
                let wordLength = script.getTextWidth(word)
                if(lineLengthMax - wordLength < 0) {
                    if(newPage <= 0) addNewPage(script)
                    decrementLine()
                    lineLengthMax = 6
                    lineLength = 0
                }
                script.text(word, 1.5 + lineLength, line)
                lineLengthMax -= (wordLength + .1)
                lineLength += (wordLength + .1)
            })
        }
        if(Array.isArray(words)) {
            words.forEach(wordItem=> {
                script.setFont(...selectFont(wordItem))
                const splitWords = wordItem.text.trim().split(' ')
                addDescriptionWords(splitWords)
            })
        }else{
            const splitWords = words.trim().split(' ')
            addDescriptionWords(splitWords)
        }
    }

    const addItems = (type, script, words, text, index) => {
        if(type === 'transition') addTransiton(script, words)
        if(type === 'character') addCharacter(script, words)
        if(type === 'parenthetical') addParenthetical(script, words)
        if(type === 'heading') addHeading(script, text, index, words)
        if(type === 'dialog') addDialog(script, words)
        if(!type) addDescription(script, words)
    }

    const createPDF = (text) => {
        const script = createPage()
        script.setFontSize(12)
        text.forEach((item, index)=> {
            script.setFont('CourierPrime-Regular', 'normal')
            if(newPage <= 0) addNewPage(script)
            const words = assignWords(item)
            addItems(item.type, script, words, text, index)
            decrementLine()
        })
        script.save('script-test-export.pdf')
    }


    return(
        <CreatePDF onClick={()=>createPDF(props.value)}>Export test</CreatePDF>
    )
}

export default CreatePDFButton

const CreatePDF = styled.button`
    height: 40px;
    min-width: 150px;
    background-color: var(--primary-text);
    color: var(--sidebar);
    border-radius: 5px;
    margin-left: 20px;
    @media(max-width: 500px) {
        min-width: 120px;
    }
`