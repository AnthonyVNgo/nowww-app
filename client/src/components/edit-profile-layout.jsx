import { useState, useContext } from "react"

// Components 
import ModalDialog from "./modal-dialog"
import FileUploader from "./file-uploader"

// Lib 
import AppContext from "../lib/app-context"

const EditProfileLayout = (props) => {
  const userDetails = props.userDetails
  const getProfileDetails = props.getProfileDetails
  const getProfilePicture = props.getProfilePicture
  const profilePictureUrl = props.profilePictureUrl
  const imgSrc = props.imgSrc
  
  const isDisabled = profilePictureUrl === null
  ? true
  : false

  const [bio, setBio] = useState(userDetails.bio)
  const [tagline, setTagline] = useState(userDetails.tagline)
  const [linkedin, setLinkedIn] = useState(userDetails.linkedin)
  const [github, setGitHub] = useState(userDetails.github)
  const [dribbble, setDribbble] = useState(userDetails.dribbble)
  const [medium, setMedium] = useState(userDetails.medium)
  const [twitter, setTwitter] = useState(userDetails.twitter)
  const [youtube, setYoutube] = useState(userDetails.youtube)
  const [instagram, setInstagram] = useState(userDetails.instagram)
  const [inputValue, setInputValue] = useState({bio, tagline, linkedin, github, dribbble, medium, twitter, youtube, instagram})

  const { handleLogOut } = useContext(AppContext)

  const deleteUser = () => {
    const options = {
      method: 'DELETE',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/delete-profile', options)
    handleLogOut()
  }

  const deleteAllEntries = () => {
    const options = {
      method: 'DELETE',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/delete-all-entries', options)
      .then(deleteUser())
  }

  const handleDeleteButton = () => {
    deleteAllEntries()
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputValue({...inputValue, bio})
    const options = {
      method: 'PUT',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputValue)
    };
    fetch('/api/edit-profile', options)
      .then(res => {
        getProfileDetails()
      })
  }

  return (
    <div className="row justify-content-center my-5">
      <div className="col">
      
        <div className="d-flex justify-content-center">
          <div className="ratio ratio-1x1 w-25">
            <img src={imgSrc} alt="profile" className="img-thumbnail rounded-circle border border-5 mb-3" style={{'objectFit':'cover'}}/>
          </div>
        </div>

        <FileUploader profilePicture={imgSrc} getProfilePicture={getProfilePicture} isDisabled={isDisabled}/>

        <form id='now-details-form' onSubmit={handleSubmit}>
          <div className="mb-3 row">
            <label htmlFor="tagline" className="col-3 col-form-label">Tagline</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="tagline" 
                name="tagline"
                placeholder="Tagline"
                value={tagline}
                maxLength={60}
                onChange={e => {setTagline(e.target.value); setInputValue({...inputValue, tagline: e.target.value}) }}
                />
            </div>
          </div>
          <div className="row align-items-start mb-3">
            <label htmlFor="bio" className="col-3 form-label">Bio</label>
            <div className="col-9">
              <textarea 
                className="form-control-plaintext border-bottom" 
                id="bio" 
                rows="3"
                placeholder="bio"
                value={bio}
                maxLength={280}
                type="text"
                name="bio"
                onChange={e => {setBio(e.target.value); setInputValue({...inputValue, bio: e.target.value})}}
                >
                </textarea>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="github" className="col-3 col-form-label">GitHub</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="github" 
                name="github"
                placeholder="Github"
                value={github}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setGitHub(e.target.value); setInputValue({...inputValue,github: e.target.value})}}
                />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="linkedin" className="col-3 col-form-label">LinkedIn</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="linkedin" 
                name="linkedin"
                placeholder="Linkedin"
                value={linkedin}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setLinkedIn(e.target.value); setInputValue({...inputValue,linkedin: e.target.value})}}
                />   
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="dribbbl" className="col-3 col-form-label">Dribbble</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="dribbble" 
                name="dribbble"
                placeholder="Dribbble"
                value={dribbble}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setDribbble(e.target.value); setInputValue({...inputValue,dribbble: e.target.value})}}
                />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="medium" className="col-3 col-form-label">Medium</label>
            <div className="col-9">
              <input 
                className="form-control-plaintext border-bottom" 
                id="medium" 
                name="medium"
                type="text" 
                placeholder="Medium"
                value={medium}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setMedium(e.target.value); setInputValue({...inputValue,medium: e.target.value})}}
                />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="twitter" className="col-3 col-form-label">Twitter</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="twitter" 
                name="twitter"
                placeholder="Twitter"
                value={twitter}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setTwitter(e.target.value); setInputValue({...inputValue,twitter: e.target.value})}}
                />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="youtube" className="col-3 col-form-label">YouTube</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="youtube" 
                name="youtube"
                placeholder="YouTube"
                value={youtube}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setYoutube(e.target.value); setInputValue({...inputValue,youtube: e.target.value})}}
                />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="instagram" className="col-3 col-form-label">Instagram</label>
            <div className="col-9">
              <input 
                type="text" 
                className="form-control-plaintext border-bottom" 
                id="instagram" 
                name="instagram"
                placeholder="Instagram"
                value={instagram}
                pattern="[a-zA-Z0-9-]+"
                onChange={e => {setInstagram(e.target.value); setInputValue({...inputValue,instagram: e.target.value})}}
                />
            </div>
          </div>
          <div className="d-flex justify-space-between"> 
            <button type="submit" form='now-details-form' className="btn btn-primary sign-up-btn w-fit-content">
              Save
            </button>       
          </div>     
        </form>

        <button type="button" className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
        </button>
        <ModalDialog handleDeleteButton={handleDeleteButton} />
      </div>
    </div>
  )
}

export default EditProfileLayout