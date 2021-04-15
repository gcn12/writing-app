import styled from 'styled-components'
import { jsPDF } from 'jspdf'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { db } from '../../../firebase'
import '../../../App.css'
import '../../../CourierPrime-Regular-normal'
import '../../../CourierPrime-Bold-normal'

const Screenplay = (props) => {

    useEffect(()=> {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .get()
        .then(data=> {
            document.getElementById('content').value = data.data().text
        })
        // eslint-disable-next-line
    }, [])

    const saveData = () => {
        const text = document.getElementById('content').value
        db.collection('users')
        .doc(props.userData.userID)
        .collection('files')
        .doc(props.match.params.fileID)
        .update({
            text
        })
        .catch(err=>console.log(err))
    }

    const getContent = () => {
        const content = document.getElementById('content')
        const divs = Array.from(content.children)
        divs.forEach(div=> {
            div.className = 'hello'
            div.tabIndex = 0
            console.log(div)
            content.appendChild(div)
        })
    }

    const createPDF = () => {
        const script = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [8.5, 11]
        })
        let line = 1
        let newPage = 53
        let currentPage = '2'
        script.lineHeightProportion = 1
        script.setFontSize(12)
        const text = document.getElementById('content').value
        const splitText = text.split('\n')
        for(let i = 0; i<splitText.length; i++) {
            if(newPage <= 0) {
                script.addPage()
                script.text(currentPage + '.', script.internal.pageSize.width - 1, .5)
                currentPage = String(Number(currentPage) + 1)
                line = 1
                newPage = 53
            }
            const words = splitText[i]
            if(words.includes('INT.') || words.includes('EXT.')) {
                script.setFont('CourierPrime-Bold', 'normal')
                script.text(words, 1.5, line)
            } else if (words.toUpperCase() === words && splitText[i+1].length > 0) {
                script.setFont('CourierPrime-Regular', 'normal')
                script.text(words, 3.7, line)
            }else if (words[0] === '(') {
                const lineWrap = script.splitTextToSize(words, 2)
                script.setFont('CourierPrime-Regular', 'normal')
                script.text(lineWrap, 3.1, line)
                if(words[i+1] && words[i+1].length !== 0) {
                    line+= (.17 * lineWrap.length)
                }
                newPage -= lineWrap.length
            } else if((splitText[i-1].toUpperCase() === splitText[i-1] && splitText[i-1].length > 0)||splitText[i-1][0]==='(') {
                const lineWrap = script.splitTextToSize(words, 3.3)
                script.text(lineWrap, 2.5, line)
                line+= (.17 * lineWrap.length)
                newPage -= lineWrap.length
            }else {
                const lineWrap = script.splitTextToSize(words, 6)
                script.setFont('CourierPrime-Regular', 'normal')
                script.text(lineWrap, 1.5, line)
                if(words[i+1] && words[i+1].length !== 0) {
                    line+= (.17 * lineWrap.length)
                }
                newPage -= lineWrap.length
            }
            line+=.17
            newPage -= 1
        }
        
        script.save('script-test-export.pdf')
    }

    const getText = () => {
        const text = document.getElementById('content')
        console.log(text.value.split('\n'))
    }

    return(
        <Container>
            <div>
                <button style={{padding: '10px', border: '1px solid black'}} onClick={createPDF}>createPDF</button>
            </div>
            <ScreenplayContainer id='content'></ScreenplayContainer>
            <button onClick={saveData}>save</button>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(Screenplay)

export const Container = styled.div`
    display: flex;
    justify-content: center;
`

const ScreenplayContainer = styled.textarea`
    border: 3px solid hsl(0, 200%, 5%);
    width: 70vw;
    height: 300px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    font-family: 'Courier Prime', monospace;
`