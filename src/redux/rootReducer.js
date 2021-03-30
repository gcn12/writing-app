import { combineReducers } from 'redux'
import appReducer from './reducers/appReducer'
import dashboardReducer from './reducers/dashboardReducer'

export default combineReducers({
    app: appReducer,
    dashboard: dashboardReducer,
})