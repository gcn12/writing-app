export const CURRENT_PROJECT_ID = 'CURRENT_PROJECT_ID'
export const NOTES_DATA = 'NOTES_DATA'
export const BREADCRUMBS = 'BREADCRUMBS'

export function breadcrumbs(data) {
    return(dispatch) => {
        dispatch({type: BREADCRUMBS, payload: data})
    }
}

export function notesData(data) {
    return(dispatch) => {
        dispatch({type: NOTES_DATA, payload: data})
    }
}

export function currentProjectID(data) {
    return(dispatch) => {
        dispatch({type: CURRENT_PROJECT_ID, payload: data})
    }
}