export const CURRENT_PROJECT_ID = 'CURRENT_PROJECT_ID'
export const USER_DATA = 'USER_DATA'
export const PROJECT_FILES = 'PROJECT_FILES'
export const CURRENT_FILE_ID = 'CURRENT_FILE_ID'
export const OUTLINE_DATA = 'OUTLINE_DATA'
export const OUTLINE_ITEMS_DISPLAY = 'OUTLINE_ITEMS_DISPLAY'
export const OUTLINE_ITEMS_FOR_UPDATE = 'OUTLINE_ITEMS_FOR_UPDATE'
export const NOTES_DATA = 'NOTES_DATA'
export const DASHBOARD_CURRENT_SECTION = 'DASHBOARD_CURRENT_SECTION'
export const ROOT_DOCS = 'ROOT_DOCS'
export const LAYER_ONE_DOCS = 'LAYER_ONE_DOCS'
export const LAYER_TWO_DOCS = 'LAYER_TWO_DOCS'
export const LAYER_THREE_DOCS = 'LAYER_THREE_DOCS'
export const CURRENT_LAYER = 'CURRENT_LAYER'
export const COLOR_THEMES = 'COLOR_THEMES'
export const COLORS = 'COLORS'
export const TASKS = 'TASKS'
export const GOALS = 'GOALS'
export const RESET = 'RESET'
export const GOAL_IS_VISIBLE = 'GOAL_IS_VISIBLE'

export function goalIsVisible(data) {
    return(dispatch) => {
        dispatch({type: GOAL_IS_VISIBLE, payload: data})
    }
}

export function reset() {
    return(dispatch) => {
        dispatch({type: RESET})
    }
}

export function goals(data) {
    return(dispatch) => {
        dispatch({type: GOALS, payload: data})
    }
}

export function tasks(data) {
    return(dispatch) => {
        dispatch({type: TASKS, payload: data})
    }
}

export function colors(data) {
    return(dispatch) => {
        dispatch({type: COLORS, payload: data})
    }
}

export function colorThemes(data) {
    return(dispatch) => {
        dispatch({type: COLOR_THEMES, payload: data})
    }
}


export function currentLayer(data) {
    return(dispatch) => {
        dispatch({type: CURRENT_LAYER, payload: data})
    }
}

export function layerThreeDocs(data) {
    return(dispatch) => {
        dispatch({type: LAYER_THREE_DOCS, payload: data})
    }
}

export function layerTwoDocs(data) {
    return(dispatch) => {
        dispatch({type: LAYER_TWO_DOCS, payload: data})
    }
}

export function layerOneDocs(data) {
    return(dispatch) => {
        dispatch({type: LAYER_ONE_DOCS, payload: data})
    }
}

export function rootDocs(data) {
    return(dispatch) => {
        dispatch({type: ROOT_DOCS, payload: data})
    }
}

export function outlineItemsForUpdate(data) {
    return(dispatch) => {
        dispatch({type: OUTLINE_ITEMS_FOR_UPDATE, payload: data})
    }
}

export function outlineItemsDisplay(data) {
    return(dispatch) => {
        dispatch({type: OUTLINE_ITEMS_DISPLAY, payload: data})
    }
}

export function dashboardCurrentSection(data) {
    return(dispatch) => {
        dispatch({type: DASHBOARD_CURRENT_SECTION, payload: data})
    }
}

export function notesData(data) {
    return(dispatch) => {
        dispatch({type: NOTES_DATA, payload: data})
    }
}

export function outlineData(data) {
    return(dispatch) => {
        dispatch({type: OUTLINE_DATA, payload: data})
    }
}

export function currentFileID(data) {
    return(dispatch) => {
        dispatch({type: CURRENT_FILE_ID, payload: data})
    }
}

export function projectFiles(data) {
    return(dispatch) => {
        dispatch({type: PROJECT_FILES, payload: data})
    }
}

export function userData(data) {
    return(dispatch) => {
        dispatch({type: USER_DATA, payload: data})
    }
}

export function currentProjectID(data) {
    return(dispatch) => {
        dispatch({type: CURRENT_PROJECT_ID, payload: data})
    }
}

