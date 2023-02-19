import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './Authentication/authenticationSlice'
import profileReducer from './Profile/profileSlice'

export default configureStore({
  reducer: {
    authentication: authenticationReducer,
    profile: profileReducer,
  }
})