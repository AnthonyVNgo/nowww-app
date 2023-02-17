import {createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
}

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setFalse: (state) => {
      state.isAuthenticated = false
    },
    setTrue: (state) => {
      state.isAuthenticated = true
    },
  }
})

console.log(authenticationSlice)

export const {setFalse, setTrue} = authenticationSlice.actions
export default authenticationSlice.reducer