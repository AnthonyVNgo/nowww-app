import { useState } from "react";
import Axios from "axios";

const FileUploader = (props) => {
  const isDisabled = props.isDisabled
  const getProfilePicture = props.getProfilePicture
  const setProfilePictureUrl = props.setProfilePictureUrl
  
  const [file, setFile] = useState(null)

  const isUploadDisabled = file === null 
    ? true
    : false

  const handleSubmitPicture = async (event) => {
    try {
      event.preventDefault()
      const formData = new FormData();
      formData.append("image", file)

      await Axios({
        method: 'post', 
        url: '/api/upload-profile-picture', 
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
          'Content-Type': 'multipart/form-data',
        },
        data: formData
      })
      getProfilePicture()
    } catch(err) {
      console.error(err)
    }
  }

  const handleDeletePicture = async (event) => {
    try {
      await Axios.delete('/api/delete-profile-picture', {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
        }
      })
      setProfilePictureUrl(null)
    } catch(err) {
      console.error(err)
    }
  }

  return ( 
    <>
      <form onSubmit={handleSubmitPicture} className="my-3 row">
        <div className="col-12">
          <input onChange={e => setFile(e.target.files[0])} type="file" accept="image/*" className="form-control mb-3" />
        </div>
        <div className="col-6">
          <button type="submit" className="btn btn-primary w-100" disabled={!isDisabled || isUploadDisabled}>Upload</button>
        </div>
        <div className="col-6">
          <button type="button" onClick={handleDeletePicture} className="btn btn-primary w-100" disabled={isDisabled}>Delete Picture</button>
        </div>
      </form>
    </>
  )
}

export default FileUploader