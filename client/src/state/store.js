import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './authentication/authenticationSlice'

export default configureStore({
  reducer: {
    authentication: authenticationReducer,
  }
})