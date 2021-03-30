import * as actions from '../actions/dashboardActions'

const initialState = {
    showProjects: true,
    projects: [],
}

const dashboardReducer = (state=initialState, action) => {
    switch(action.type) {
        case actions.SHOW_PROJECTS:
            return {
                ...state,
                showProjects: action.payload
            }
        case actions.PROJECTS:
            return {
                ...state,
                projects: action.payload
            }
        default:
            return state
    }
}

export default dashboardReducer