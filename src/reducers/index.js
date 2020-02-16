import postReducer from './postReducer'
import userReducer from './userReducer'
import userPostReducer from './userPostReducer'
import { combineReducers } from 'redux'

const allReducer = combineReducers({
  postReducer,
  userReducer,
  userPostReducer
})

export default allReducer