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
    rootDocs: [],
    layerOneDocs: [],
    layerTwoDocs: [],
    layerThreeDocs: [],
    currentLayer: null,
    colorThemes: [],
    colors: {},
    tasks: [],
    goals: {goal: 100, wordsWritten: 0},
}

const appReducer = (state=initialState, action) => {
    switch(action.type) {
        case actions.GOALS:
            return {
                ...state,
                goals: action.payload
            }
        case actions.TASKS:
            return {
                ...state,
                tasks: action.payload
            }
        case actions.COLORS:
            return {
                ...state,
                colors: action.payload
            }
        case actions.COLOR_THEMES:
            return {
                ...state,
                colorThemes: action.payload
            }
        case actions.CURRENT_LAYER:
            return {
                ...state,
                currentLayer: action.payload
            }
        case actions.LAYER_THREE_DOCS:
            return {
                ...state,
                layerThreeDocs: action.payload
            }
        case actions.LAYER_TWO_DOCS:
            return {
                ...state,
                layerTwoDocs: action.payload
            }
        case actions.LAYER_ONE_DOCS:
            return {
                ...state,
                layerOneDocs: action.payload
            }
        case actions.ROOT_DOCS:
            return {
                ...state,
                rootDocs: action.payload
            }
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