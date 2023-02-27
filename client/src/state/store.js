import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './authentication/authenticationSlice'
import profileReducer from './profile/profileSlice'
import profilePictureReducer from './profile/profilePictureSlice'
import galleryReducer from './gallery/gallery-slice'

export default configureStore({
  reducer: {
    authentication: authenticationReducer,
    profile: profileReducer,
    profilePicture: profilePictureReducer,
    gallery: galleryReducer,
  }
})