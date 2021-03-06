export const CURRENT_PROJECT_ID = 'CURRENT_PROJECT_ID'
export const NOTES_DATA = 'NOTES_DATA'
export const BREADCRUMBS = 'BREADCRUMBS'
export const SORT_METHOD = 'SORT_METHOD'
export const RESET_DASHBOARD = 'RESET_DASHBOARD'

export function resetDashboard() {
    return(dispatch) => {
        dispatch({type: RESET_DASHBOARD})
    }
}

export function sortMethod(data) {
    return(dispatch) => {
        dispatch({type: SORT_METHOD, payload: data})
    }
}

export function breadcrumbs(data) {
    return(dispatch) => {
        dispatch({type: BREADCRUMBS, payload: data})
    }
}

export function currentProjectID(data) {
    return(dispatch) => {
        dispatch({type: CURRENT_PROJECT_ID, payload: data})
    }
}