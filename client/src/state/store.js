import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './Authentication/authenticationSlice'
import profileReducer from './Profile/profileSlice'
import profilePictureReducer from './Profile/profilePictureSlice'

export default configureStore({
  reducer: {
    authentication: authenticationReducer,
    profile: profileReducer,
    profilePicture: profilePictureReducer,
  }
})