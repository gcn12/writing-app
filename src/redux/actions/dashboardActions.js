export const SHOW_PROJECTS = 'SHOW_PROJECTS'
export const PROJECTS = 'PROJECTS'
export const CURRENT_PROJECT_ID = 'CURRENT_PROJECT_ID'
export const NOTES_DATA = 'NOTES_DATA'

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

export function showProjects(data) {
    return(dispatch) => {
        dispatch({type: SHOW_PROJECTS, payload: data})
    }
}

export function projects(data) {
    return(dispatch) => {
        dispatch({type: PROJECTS, payload: data})
    }
}