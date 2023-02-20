import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import Axios from 'axios'

const initialState = {
  galleryElements: [],
  isLoading: false,
}

export const getGalleryElements = createAsyncThunk('gallery/getGalleryElements', async () => {
  try {
   const res = await Axios.get("/api/gallery", {
     headers: {
       "X-Access-Token": window.localStorage.getItem("react-context-jwt"),
     },
   })
   const galleryData = res.data;
   return galleryData
  } catch(err) {
   console.error(err)
  }
 })

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGalleryElements.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGalleryElements.fulfilled, (state, action) => {
      state.isLoading = false;
      state.galleryElements = action.payload;
      state.error = '';
    });
    builder.addCase(getGalleryElements.rejected, (state, action) => {
      state.isLoading = false;
      state.galleryElements = [];
      state.error = action.error.message;
    });
  },
})

export default gallerySlice.reducer