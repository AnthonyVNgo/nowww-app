import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import Axios from 'axios'

const initialState = {
  isLoading: false,
  userDetails: '',
  error: '',
}

export const getUserDetails = createAsyncThunk('profile/getUserDetails', async (getProfilePath, thunkAPI) => {
  try {
    const res = await Axios.get(`${getProfilePath}`,{
      headers: {
        "X-Access-Token": window.localStorage.getItem("react-context-jwt"),
      },
    })
    const userData = res.data
    return userData
  } catch(err) {
    console.error(err)
  }
})

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUserDetails.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userDetails = action.payload;
      state.error = '';
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.userDetails = '';
      state.error = action.error.message;
    });
  },
});

// export const {  } = profileSlice.actions
export default profileSlice.reducer