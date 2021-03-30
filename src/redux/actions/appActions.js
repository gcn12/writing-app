export const CURRENT_PROJECT_ID = 'CURRENT_PROJECT_ID'
export const USER_DATA = 'USER_DATA'
export const PROJECT_FILES = 'PROJECT_FILES'
export const CURRENT_FILE_ID = 'CURRENT_FILE_ID'
export const OUTLINE_DATA = 'OUTLINE_DATA'
export const OUTLINE_ITEMS_DISPLAY = 'OUTLINE_ITEMS_DISPLAY'
export const OUTLINE_ITEMS_FOR_UPDATE = 'OUTLINE_ITEMS_FOR_UPDATE'
export const NOTES_DATA = 'NOTES_DATA'
export const DASHBOARD_CURRENT_SECTION = 'DASHBOARD_CURRENT_SECTION'

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

