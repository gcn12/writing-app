import styled from 'styled-components'
import { jsPDF } from 'jspdf'
import '../../App.css'
import '../../fonts/CourierPrime-Regular-normal'
import '../../fonts/CourierPrime-Bold-normal'

const Screenplay = () => {
    const getContent = () => {
        const content = document.getElementById('content')
        const divs = Array.from(content.children)
        divs.forEach(div=> {
            div.className = 'hello'
            div.tabIndex = 0
            div.onclick = checkFocus
            div.confocus = checkFocus
            console.log(div)
            content.appendChild(div)
        })
    }

    const checkFocus = () => {
        console.log(document.activeElement)
    }

    // const createPDF = () => {
    //     let pageNumber = '1'
    //     // let remainingSpace = 11
    //     const doc = new jsPDF({
    //         orientation: 'portrait', 
    //         unit: 'in',  
    //         format: [8.5, 11]
    //     })
    //     doc.lineHeightProportion = 1
    //     doc.setFontSize(12)
    //     doc.setFont('CourierPrime-Bold', 'normal')
    //     doc.text(pageNumber + '.', doc.internal.pageSize.width - 1, .5)
    //     pageNumber = String(Number(pageNumber) + 1)
    //     doc.text('INT. HOUSE - DAY', 1.5, 1)
    //     doc.setFont('CourierPrime-Regular', 'normal')
    //     const splitTitle = doc.splitTextToSize('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 6)
    //     doc.text(splitTitle, 1.5, 1.31)
    //     const splitText2 = doc.splitTextToSize('Venenatis a condimentum vitae sapien pellentesque. Gravida neque convallis a cras. Dictum sit amet justo donec enim diam vulputate ut pharetra. Massa tincidunt dui ut ornare. Elit eget gravida cum sociis natoque penatibus et magnis dis. Fermentum dui faucibus in ornare quam viverra orci sagittis. Commodo sed egestas egestas fringilla phasellus.', 6)
    //     doc.text(splitText2, 1.5, 1.31 + splitTitle.length * .21)
    //     doc.text('DANIEL', 3.7, 4.31)
    //     const dialog = doc.splitTextToSize('Sit amet mattis vulputate enim nulla aliquet. Urna porttitor rhoncus dolor purus non enim praesent elementum.', 3.3)
    //     doc.text(dialog, 2.5, 4.51)
    //     doc.addPage()
    //     doc.text(pageNumber + '.', doc.internal.pageSize.width - 1, .5)
    //     doc.save('a4.pdf')
    // }

    const createPDF = () => {
        let pageNumber = '2'
        // let remainingSpace = 55
        let line = 1
        let newPage = 53
        const doc = new jsPDF({
            orientation: 'portrait', 
            unit: 'in',  
            format: [8.5, 11]
        })
        doc.lineHeightProportion = 1
        doc.setFontSize(12)
        doc.setFont('CourierPrime-Regular', 'normal')
        // doc.text(pageNumber + '.', doc.internal.pageSize.width - 1, .5)
        const splitTitle = doc.splitTextToSize('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum et sollicitudin ac orci phasellus. Pharetra et ultrices neque ornare aenean euismod elementum nisi. Turpis in eu mi bibendum neque.', 6)
        splitTitle.forEach(title=> {
            doc.text(title, 1.5, line)
            line+=.17
            newPage -= 1
            if(newPage === 0) {
                doc.addPage()
                doc.text(pageNumber + '.', doc.internal.pageSize.width - 1, .5)
                pageNumber = String(Number(pageNumber) + 1)
                line = 1
                newPage = 53
            }
        })
        line+= .3
        doc.setFont('CourierPrime-Bold', 'normal')
        doc.text('INT. HOUSE - DAY', 1.5, line)
        line+=.3
        doc.setFont('CourierPrime-Regular', 'normal')
        doc.text('Dolor sit amet consectetur adipiscing elit pellentesque', 1.5, line)
        doc.save('a4.pdf')
    }

    return(
        <Container>
            <div>
                <button style={{padding: '10px', border: '1px solid black'}} onClick={createPDF}>createPDF</button>
            </div>
            <div>
                <button style={{padding: '10px', border: '1px solid black'}} onClick={getContent}>add class and tabindex</button>
            </div>
            <ScreenplayContainer id='content' contentEditable></ScreenplayContainer>
            <div>
                <button style={{padding: '10px', border: '1px solid black'}} onClick={checkFocus}>check focus</button>
            </div>
        </Container>
    )
}

export default Screenplay

export const Container = styled.div`
    display: flex;
    justify-content: center;
`

const ScreenplayContainer = styled.div`
    border: 3px solid hsl(0, 200%, 5%);
    width: 70vw;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    font-family: 'Courier Prime', monospace;
`