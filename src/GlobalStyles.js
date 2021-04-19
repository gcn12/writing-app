import { createGlobalStyle } from 'styled-components'
import { connect } from 'react-redux'
const GlobalStyles = createGlobalStyle`

    html {
        scroll-behavior: smooth;
        --background: ${props=>props.colors.background};
        --sidebar: ${props=>props.colors.sidebar};
        --primary-text: ${props=>props.colors.primaryText};
        --highlight: ${props=>props.colors.highlight};
        --secondary: ${props=>props.colors.secondary};
    }

    html, body {
        background-color: var(--background);
        height: 100%;
        overflow: ${props=>props.isDashboard ? 'hidden' : 'scroll'};
    }

    body {
        /* position: fixed; */
        /* height: 100%; */
        /* overscroll-behavior-y: ${props=>props.isDashboard ? 'none' : 'scroll'}; */
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
    colors: state.app.colors,    
})

export default connect(mapStateToProps)(GlobalStyles)