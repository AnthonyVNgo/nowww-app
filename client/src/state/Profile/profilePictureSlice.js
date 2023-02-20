import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import Axios from 'axios'

const initialState = {
  isLoading: false,
  profilePictureUrl: null,
  error: '',
}

export const getProfilePicture = createAsyncThunk('profile/getProflePicture', async (getProfilePicturePath, thunkAPI) => {
  try {
    const res = await Axios.get(`${getProfilePicturePath}`, {
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
      }
    })
    const pictureData = res.data
    if (pictureData.rowCount === 0) {
      return null
    } else {
      return pictureData
    }
  } catch(err) {
    console.error(err)
  }
})

const profilePictureSlice = createSlice({
  name: 'profilePicture',
  initialState,
  reducers: {
    setProfilePictureUrlNull: (state) => {
      state.profilePictureUrl = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProfilePicture.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProfilePicture.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profilePictureUrl = action.payload;
      state.error = '';
    });
    builder.addCase(getProfilePicture.rejected, (state, action) => {
      state.isLoading = false;
      state.profilePictureUrl = null;
      state.error = action.error.message;
    });
  },
});

export const { setProfilePictureUrlNull } = profilePictureSlice.actions
export default profilePictureSlice.reducer