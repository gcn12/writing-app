import * as actions from '../actions/dashboardActions'

const initialState = {
    breadcrumbs: [{name: 'all files', docId: null}],
}

const dashboardReducer = (state=initialState, action) => {
    switch(action.type) {
        case actions.BREADCRUMBS:
            return {
                ...state,
                breadcrumbs: action.payload
            }
        default:
            return state
    }
}

export default dashboardReducer