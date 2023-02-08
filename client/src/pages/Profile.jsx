import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react"
import Axios from 'axios'

// Components 
import EditProfileLayout from "../components/edit-profile-layout";
import ProfileLayout from "../components/profile-layout";
import NowEntryContainer from "../components/now-entry-container";
import Loading from "../components/loading";

const Profile = () => {
  const [userDetails, setUserDetails] = useState('')  
  const [isLoading, setIsLoading] = useState(null)
  
  let location = useLocation().pathname
  let isMyProfile = location === '/my-profile' || location === '/edit-profile' 
    ? true
    : false

  let getProfilePath = isMyProfile 
    ? '/api/my-profile'
    : `/api${location}`

  const getProfileDetails = async () => {
    try {
      setIsLoading(true)
      const res = await Axios.get(`${getProfilePath}`,{
        headers: {
          "X-Access-Token": window.localStorage.getItem("react-context-jwt"),
        },
      })
      const userData = res.data
      setUserDetails(userData)
      setIsLoading(false)
    } catch(err) {
      console.error(err)
    }
  }

  const [profilePictureUrl, setProfilePictureUrl] = useState(null)

  let getProfilePicturePath = isMyProfile
    ? '/api/profile-picture'
    : `/api/profile-picture${location}`
  
  const imgSrc = profilePictureUrl === null
    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png' // add image to static folder
    : profilePictureUrl

  const getProfilePicture = async () => {
    try {
      const res = await Axios.get(`${getProfilePicturePath}`, {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
        }
      })
      const pictureData = res.data
      setProfilePictureUrl(pictureData)
    } catch(err) {
      console.error(err)
    }
  }
  
  useEffect(() => {
    getProfileDetails()
    getProfilePicture()
  }, [location])

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-9 col-lg-7 col-xl-6 border p-5 pt-2 rounded position-relative">
        {location === '/my-profile' || !isMyProfile
         ? <ProfileLayout userDetails={userDetails} imgSrc={imgSrc} location={location} isLoading={isLoading}/>
         : null
        }
        {location === '/edit-profile' && isLoading 
          ? <Loading />
          : null
        }
        {location === '/edit-profile' && !isLoading 
          ? <EditProfileLayout userDetails={userDetails} profilePictureUrl={profilePictureUrl} imgSrc={imgSrc} getProfileDetails={getProfileDetails} getProfilePicture={getProfilePicture} setProfilePictureUrl={setProfilePictureUrl} location={location} isLoading={isLoading}/>
          : null
        }
        <NowEntryContainer />
      </div>
    </div>
  )
}

export default Profile