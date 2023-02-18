import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './Authentication/authenticationSlice'

export default configureStore({
  reducer: {
    authentication: authenticationReducer,
  }
})