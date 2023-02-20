import { useState } from "react"
import Axios from 'axios'

// Redux 
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from "../../../../state/Profile/profileSlice"

// Components 
import ModalDialog from "./modal-dialog"
import FileUploader from "./file-uploader"
import EditProfileInput from "./edit-profile-input"
import ProfileDetailsPlaceholder from "../placeholder/profile-details-placeholder"

// Assets 
import placeholderImg from '../../../../assets/placeholder.png'

const EditProfileLayout = () => {
  const { isLoading, userDetails, error} = useSelector((state) => state.profile)
  const { profilePictureUrl } = useSelector((state) => state.profilePicture)
  const dispatch = useDispatch()
  
  const imgSrc = profilePictureUrl === null
    ? placeholderImg
    : profilePictureUrl

  const [inputValue, setInputValue] = useState({
    bio: userDetails.bio, 
    tagline: userDetails.tagline, 
    linkedin: userDetails.linkedin, 
    github: userDetails.github, 
    dribbble: userDetails.dribbble, 
    medium: userDetails.medium, 
    twitter: userDetails.twitter, 
    youtube: userDetails.youtube, 
    instagram: userDetails.instagram
  })

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setInputValue({...inputValue})

      await Axios.put('/api/edit-profile', inputValue, {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
        },
      })
      dispatch(getUserDetails())
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="py-4"> 
        <div className="d-flex justify-content-center my-3">
          <div className="ratio ratio-1x1 w-25">
            <img src={imgSrc} alt="profile" className="img-thumbnail rounded-circle border border-5" style={{'objectFit':'cover'}}/>
          </div>
        </div>
      </div>

        <FileUploader />

        {isLoading
          ? <ProfileDetailsPlaceholder />
          :
          <form id='now-details-form' onSubmit={handleSubmit}>
          
          {Object.entries(inputValue).map(([key, value]) => (
              <EditProfileInput key={key} label={key} value={value} inputValue={inputValue} setInputValue={setInputValue}/>
          ))}

          <div className="d-flex justify-space-between"> 
            <button type="submit" form='now-details-form' className="btn btn-primary sign-up-btn w-fit-content">
              Save
            </button>       
          </div>      
        </form>
        }

        <button type="button" className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
        </button>
        
        <ModalDialog />
    </>
  )
}

export default EditProfileLayout