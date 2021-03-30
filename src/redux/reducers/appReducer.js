import * as actions from '../actions/appActions'

const initialState = {
    userData: {},
    currentProjectID: '',
    projectFiles: [],
    currentFileID: '',
    outlineData: {},
    notesData: {},
    dashboardCurrentSection: 'projects',
    outlineItemsForUpdate: [],
    outlineItemsDisplay: [],
}

const appReducer = (state=initialState, action) => {
    switch(action.type) {
        case actions.OUTLINE_ITEMS_DISPLAY:
            return {
                ...state,
                outlineItemsDisplay: action.payload
            }
        case actions.OUTLINE_ITEMS_FOR_UPDATE:
            return {
                ...state,
                outlineItemsForUpdate: action.payload
            }
        case actions.DASHBOARD_CURRENT_SECTION:
            return {
                ...state,
                dashboardCurrentSection: action.payload
            }
        case actions.NOTES_DATA:
            return {
                ...state,
                notesData: action.payload
            }
        case actions.OUTLINE_DATA:
            return {
                ...state,
                outlineData: action.payload
            }
        case actions.CURRENT_FILE_ID:
            return {
                ...state,
                currentFileID: action.payload
            }
        case actions.PROJECT_FILES:
            return {
                ...state,
                projectFiles: action.payload
            }
        case actions.USER_DATA:
            return {
                ...state,
                userData: action.payload
            }
        case actions.CURRENT_PROJECT_ID:
            return {
                ...state,
                currentProjectID: action.payload
            }
        default:
            return state
    }
}

export default appReducer