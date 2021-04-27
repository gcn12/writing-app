import { jsPDF } from 'jspdf'
import '../../../App.css'
import '../../../CourierPrime-Regular-normal'
import '../../../CourierPrime-Bold-normal'
import '../../../CourierPrime-BoldItalic-bolditalic'
import '../../../CourierPrime-Italic-italic'

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

export const createPDF = (text) => {
    const script = createPage()
    let line = 1
    let newPage = 56
    let currentPage = '2'
    script.setFontSize(12)
    const decrementLine = () => {
        newPage -= 1
        line+= .16
    }

    const addNewPage = () => {
        insertPageBreak(script, currentPage)
        currentPage = String(Number(currentPage) + 1)
        line = 1
        newPage = 56
    }
    
    text.forEach((item, index)=> {
        script.setFont('CourierPrime-Regular', 'normal')
        if(newPage <= 0) addNewPage()
        let words
        if(item.children.length > 1) words = Object.values(item.children)
        if(item.children.length === 1) words = item.children[0].text
        if(item.type === 'heading') {
            script.setFont('CourierPrime-Bold', 'normal')
            if(text[index-1] && text[index-1].children[0].text.length===0) {
                decrementLine()
            }
            script.text(words.toUpperCase(), 1.5, line)
            return decrementLine()
        } 
        if(!item.type) {
            let lineLengthMax = 6
            let lineLength = 0
            const addDescriptionWords = (words) => {
                words.forEach(word => {
                    let wordLength = script.getTextWidth(word)
                    if(lineLengthMax - wordLength < 0) {
                        if(newPage <= 0) addNewPage()
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
            return decrementLine()
        }
        if(item.type === 'transition') {
            const stringWidth = script.getTextWidth(words)
            script.text(words.toUpperCase(), script.internal.pageSize.width - 1 - stringWidth, line)
            return decrementLine()
        }
        if(item.type === 'character') {
            script.text(words.toUpperCase(), 3.7, line)
            return decrementLine()
        }
        if(item.type === 'parenthetical') {
            const lineWrap = script.splitTextToSize(words, 2)
            lineWrap.forEach(item=> {
                return script.text(item, 3.1, line)
            })
        }
        if(item.type === 'dialog') {
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
            if(newPage <= 0) addNewPage()
        }
        decrementLine()
    })
    script.save('script-test-export.pdf')
}