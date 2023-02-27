import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Axios from 'axios'

// Assets 
import placeholderImg from '../../../assets/placeholder.png'

const GalleryCard = (props) => {
  let element = props.element
  const userId = props.element.id
  
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/user/${element.id}`)
  }

  const [profilePictureUrl, setProfilePictureUrl] = useState(null)

  const imgSrc = profilePictureUrl === null
    ? placeholderImg
    : profilePictureUrl

  const getProfilePicture = async () => {
    try {
      const res = await Axios.get(`/api/profile-picture/user/${userId}`, {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
        }
      })
      if (res.data.rowCount === 0) {
        setProfilePictureUrl(null)
      } else {
        setProfilePictureUrl(res.data)
      }
    } catch(err) {
      console.error(err)
    }
  }  

  useEffect(() => {
    getProfilePicture()
  }, [])

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3">
      <div className="card h-100 position-relative" onClick={handleCardClick} style={{cursor: "pointer"}}>
        <div className="ratio ratio-1x1 w-100">
          <img src={imgSrc} alt="profile" className="card-img-top rounded" style={{'objectFit' : 'cover'}} />
          <div className="card-body position-absolute d-flex align-items-end rounded" style={{backgroundImage : "linear-gradient(transparent 36%, rgba(0, 0, 0, 0.87))"}}>
            <div className="text-white">
              <h6 className="card-title">{element.username}</h6>
              <p className="card-text">{element.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryCard