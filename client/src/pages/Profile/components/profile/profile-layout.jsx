// Components 
import SocialIcons from "./social-icons"
import ProfileDetailsPlaceholder from "../placeholder/profile-details-placeholder"

const ProfileLayout = (props) => {
  const userDetails = props.userDetails
  const imgSrc = props.imgSrc
  const isLoading = props.isLoading

  return (
    <>

      {isLoading 
        ? 
        <>
        <ProfileDetailsPlaceholder />
        <ProfileDetailsPlaceholder />
        <ProfileDetailsPlaceholder />
        </>
        : null
      }

      {!isLoading 
        ?
        <>
          <div className="border-bottom py-4"> 
            <div className="d-flex justify-content-center my-3">
              <div className="ratio ratio-1x1 w-25">
                <img src={imgSrc} alt="profile" className="img-thumbnail rounded-circle border border-5" style={{'objectFit':'cover'}}/>
              </div>
            </div>
            <h3>{userDetails.username}</h3>
            {userDetails.tagline
              ? <p className="text-break">{userDetails.tagline}</p>
              : <p className="text-muted">No tagline available</p>
            }
          </div>

          <div className="border-bottom py-4">
            <h5>About</h5>
            {userDetails.bio
              ? <p className="text-break">{userDetails.bio}</p>
              : <p className="text-muted">No details available</p>  
            }
          </div>

          <div className="border-bottom py-4">
            <h5 className="mb-3">Social</h5>
            <SocialIcons userDetails={userDetails} />
          </div>
        </>
        : null
      }
    </>
  )
}

export default ProfileLayout