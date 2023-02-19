import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react"
import Axios from 'axios'

// Redux 
import { useSelector, useDispatch } from 'react-redux'
import { getUserDetails } from "../../state/Profile/profileSlice";

// Components 
import EditProfileLayout from "./components/editProfile/edit-profile-layout";
import ProfileLayout from "./components/profile/profile-layout";
import NowEntryContainer from "./components/now-entry-container";

// Assets
import placeholderImg from '../../assets/placeholder.png'

const Profile = () => {
  const { isLoading, userDetails, error} = useSelector((state) => state.profile)
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
  
  const [profilePictureUrl, setProfilePictureUrl] = useState(null)

  const imgSrc = profilePictureUrl === null
    ? placeholderImg
    : profilePictureUrl

  const getProfilePicture = async () => {
    try {
      const res = await Axios.get(`${getProfilePicturePath}`, {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
        }
      })
      const pictureData = res.data
      if (pictureData.rowCount === 0) {
        setProfilePictureUrl(null)
      } else {
        setProfilePictureUrl(pictureData)
      }
    } catch(err) {
      console.error(err)
    }
  }
  
  useEffect(() => {
    getProfilePicture()
    dispatch(getUserDetails(getProfilePath))
  }, [location])

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-7 col-xl-6 border p-5 pt-2 rounded rounded-3 position-relative border-0 shadow-sm">
        {(location === '/my-profile' || !isMyProfile)
         ? <ProfileLayout 
          userDetails={userDetails} 
          imgSrc={imgSrc} 
          isLoading={isLoading}
          />
         : null
        }
        {(location === '/edit-profile')
          ? <EditProfileLayout 
            userDetails={userDetails} 
            profilePictureUrl={profilePictureUrl} 
            imgSrc={imgSrc} 
            getUserDetails={getUserDetails} 
            getProfilePicture={getProfilePicture} 
            setProfilePictureUrl={setProfilePictureUrl} 
            isLoading={isLoading}
            />
          : null
        }
        <NowEntryContainer />
      </div>
    </div>
  )
}

export default Profile