// Components 
import SocialIcons from "./social-icons"
import ProfileDetailsPlaceholder from "./profile-details-placeholder"

const ProfileLayout = (props) => {
  const userDetails = props.userDetails
  const imgSrc = props.imgSrc
  const isLoading = props.isLoading

  return (
    <div>
      <div className="d-flex justify-content-center">
      </div>

      {isLoading && 
        <>
        <ProfileDetailsPlaceholder />
        <ProfileDetailsPlaceholder />
        <ProfileDetailsPlaceholder />
        </>
      }

      {!isLoading && 
        <>
          <div className="border-bottom py-4">
            <div className="d-flex justify-content-center">
              <div className="ratio ratio-1x1 w-25">
                <img src={imgSrc} alt="profile picture" className="img-thumbnail rounded-circle border border-5 mb-3"/>
              </div>
            </div>
            <h3>{userDetails.username}</h3>
            <p className="text-break">{userDetails.tagline}</p>
          </div>

          <div className="border-bottom py-4">
            <h5>About</h5>
            {userDetails.bio && 
              <p className="text-break">{userDetails.bio}</p>
            }
            {!userDetails.bio && 
              <p className="text-muted">No details available</p>
            }
          </div>

          <div className="border-bottom py-4">
            <h5 className="mb-3">Social</h5>
            <SocialIcons userDetails={userDetails} />
          </div>
        </>
      }
    </div>
  )
}

export default ProfileLayout