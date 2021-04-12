import { connect } from 'react-redux'
import { colorThemes } from '../../../redux/actions/appActions'
import { db } from '../../../firebase'

const ColorTemplates = (props) => {

    const selectTheme = (themeColors) => {
        props.dispatch(colorThemes(themeColors))
        db.collection('users')
        .doc(props.userData.userID)
        .update({
            'preferences.colors': themeColors,
        })
        .catch(err=>console.log(err))
        // console.log(props.colorThemes)
    }

    return(
        <div>
            Color Themes:
            {props.themes.map((theme, index)=> {
                return(
                <button onClick={()=>selectTheme(theme.colors)} style={{backgroundColor: 'green', padding: '5px'}} key={index}>
                    {theme.name}
                </button>
                )
            })}
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes,
})

export default connect(mapStateToProps)(ColorTemplates)