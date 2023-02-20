import { useLocation } from "react-router-dom";
import { useEffect } from "react"

// Redux 
import { useDispatch } from 'react-redux'
import { getUserDetails } from "../../state/Profile/profileSlice";
import { getProfilePicture } from "../../state/Profile/profilePictureSlice";

// Components 
import EditProfileLayout from "./components/editProfile/edit-profile-layout";
import ProfileLayout from "./components/profile/profile-layout";
import NowEntryContainer from "./components/now-entry-container";

const Profile = () => {
  const dispatch = useDispatch()
  
  let location = useLocation().pathname
  let isMyProfile = location === '/my-profile' || location === '/edit-profile' 
    ? true
    : false

  let getProfilePath = isMyProfile 
    ? '/api/my-profile'
    : `/api${location}`

  let getProfilePicturePath = isMyProfile
    ? '/api/profile-picture'
    : `/api/profile-picture${location}`
  
  useEffect(() => {
    dispatch(getUserDetails(getProfilePath))
    dispatch(getProfilePicture(getProfilePicturePath))
  }, [location])

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-7 col-xl-6 border p-5 pt-2 rounded rounded-3 position-relative border-0 shadow-sm">
        
        {(location === '/my-profile' || !isMyProfile)
         ? <ProfileLayout />
         : null
        }

        {(location === '/edit-profile')
          ? <EditProfileLayout />
          : null
        }

        <NowEntryContainer />
      </div>
    </div>
  )
}

export default Profile