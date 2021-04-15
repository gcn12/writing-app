import { jsPDF } from 'jspdf'
import '../../../App.css'
import '../../../CourierPrime-Regular-normal'
import '../../../CourierPrime-Bold-normal'

const createPage = () => {
    return new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 11]
    })
}

export const createPDF = (text) => {
    const script = createPage()
    let line = 1
    let newPage = 56
    let currentPage = '2'
    script.lineHeightProportion = 1
    script.setFontSize(12)

    text.forEach((item, index)=> {
        if(newPage <= 0) {
            script.addPage()
            script.text(currentPage + '.', script.internal.pageSize.width - 1, .5)
            currentPage = String(Number(currentPage) + 1)
            line = 1
            newPage = 56
        }
        const words = item.children[0].text
        if(item.type === 'heading') {
            console.log(text[index-1])
            if(text[index-1] && text[index-1].children[0].text.length===0) {
                newPage -= 1
                line+=.16
            }
            script.setFont('CourierPrime-Bold', 'normal')
            script.text(words.toUpperCase(), 1.5, line)
            newPage -= 1
            line+=.16
        }
        if(!item.type) {
            const lineWrap = script.splitTextToSize(words, 6)
            script.setFont('CourierPrime-Regular', 'normal')
            lineWrap.forEach(item=> {
                script.text(item, 1.5, line)
                line+=.16
                newPage -= 1
                if(newPage <= 0) {
                    script.addPage()
                    script.text(currentPage + '.', script.internal.pageSize.width - 1, .5)
                    currentPage = String(Number(currentPage) + 1)
                    line = 1
                    newPage = 56
                }
            })
        }


        if(item.type === 'transition') {
            script.setFont('CourierPrime-Regular', 'normal')
            const stringWidth = script.getTextWidth(words)
            script.text(words.toUpperCase(), script.internal.pageSize.width - 1 - stringWidth, line)
            line+=.16
            newPage -= 1
        }
        if(item.type === 'character') {
            script.setFont('CourierPrime-Regular', 'normal')
            script.text(words.toUpperCase(), 3.7, line)
            line+= .15
            newPage -= 1
        }
        if(item.type === 'parenthetical') {
            const lineWrap = script.splitTextToSize(words, 2)
            script.setFont('CourierPrime-Regular', 'normal')
            lineWrap.forEach(item=> {
                script.text(item, 3.1, line)
                line+=.16
                newPage -= 1
                if(newPage <= 0) {
                    script.addPage()
                    script.text(currentPage + '.', 1, .5)
                    currentPage = String(Number(currentPage) + 1)
                    line = 1
                    newPage = 56
                }
            })
            // script.text(lineWrap, 3.1, line)
            // line+= (.15 * lineWrap.length)
            // newPage -= lineWrap.length
        }
        if(item.type === 'dialog') {
            const lineWrap = script.splitTextToSize(words, 3.3)
            // script.text(lineWrap, 2.5, line)
            // line+= (.15 * lineWrap.length)
            // newPage -= lineWrap.length
            lineWrap.forEach(item=> {
                script.text(item, 2.5, line)
                line+=.16
                newPage -= 1
                if(newPage <= 0) {
                    script.addPage()
                    script.text(currentPage + '.', 1, .5)
                    currentPage = String(Number(currentPage) + 1)
                    line = 1
                    newPage = 56
                }
            })
        }
        // line+=.17
        // newPage -= 1

    })
    
    script.save('script-test-export.pdf')
}