import { createGlobalStyle } from 'styled-components'
import { connect } from 'react-redux'
const GlobalStyles = createGlobalStyle`

    html {
        --background: ${props=>props.colorThemes.background};
        --sidebar: ${props=>props.colorThemes.sidebar};
        --primary-text: ${props=>props.colorThemes.primaryText};
        --highlight: ${props=>props.colorThemes.highlight};
    }

    html, body {
        background-color: var(--background);
    }

    * {
        &:focus {
            box-shadow: 0 0 0 5px rgba(21, 156, 228, 0.4);
            outline: none;
        }
    }

    html, body, div, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote,
    a, img, ol, ul, li, form, label,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, section, summary,
    time, mark, audio, video, button {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
    }  

    button {
        cursor: pointer;
        background-color: transparent;
    }

    textarea {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
    }

    h1, h2, h3, h4, h5, h6, p, a, div, label {
        line-height: 1;
        color: var(--primary-text);
    }

    button {
        color: var(--primary-text);
    }

    ol, ul {
        list-style: none;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }
`

const mapStateToProps = state => ({
    colorThemes: state.app.colorThemes    
})

export default connect(mapStateToProps)(GlobalStyles)