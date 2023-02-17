import {createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
  username: '',
  password: '',
  authInputClass: '',
}

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    rejectAuth: (state) => {
      state.isAuthenticated = false
    },
    acceptAuth: (state) => {
      state.isAuthenticated = true
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setAuthInvalidClass: (state) => {
      state.authInputClass = 'is-invalid'
    },
    clearAuthInvalidClass: (state) => {
      state.authInputClass = ''
    },
  }
})

export const { rejectAuth, acceptAuth, setUsername, setPassword, setAuthInvalidClass,clearAuthInvalidClass } = authenticationSlice.actions
export default authenticationSlice.reducer