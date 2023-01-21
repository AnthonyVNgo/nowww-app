import { useState } from "react";

const FileUploader = (props) => {
  const isDisabled = props.isDisabled
  const getProfilePicture = props.getProfilePicture
  
  const [file, setFile] = useState(null)

  const isUploadDisabled = file === null 
    ? true
    : false

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("image", file)
    const options = {
      method: 'POST',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
      },
      body: formData
    };
    fetch('/api/poster', options)
      .then(() => {
        getProfilePicture()
      })
      .catch(err => console.error(err));
  }
  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   const formData = new FormData();
  //   formData.append("image", file)
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'X-Access-Token': window.localStorage.getItem('react-context-jwt')
  //     },
  //     body: formData
  //   };
  //   fetch('/api/upload-profile-picture', options)
  //     .then(() => {
  //       // getProfilePicture()
  //       console.log('hi')
  //     })
  //     .catch(err => console.error(err));
  // }

  const handleDelete = (event) => {
    const options = {
      method: 'DELETE',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
      }
    };

    fetch('/api/delete-profile-picture', options)
      .then(() => {
        getProfilePicture()
      })
      .catch(err => console.error(err));
  }

  const handleTester = (event) => {
    //   event.preventDefault()
    const formData = new FormData();
    formData.append("image", file)
    const options = {
      method: 'POST',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
      },
      body: formData
    };
    fetch('/api/poster', options)
      .then(() => {
        console.log('hi')
      })
      .catch(err => console.error(err));
  }

  return ( 
    <>
      <form onSubmit={handleSubmit} className="my-3 row">
        <div className="col-12">
          <input onChange={e => setFile(e.target.files[0])} type="file" accept="image/*" className="form-control mb-3" />
        </div>
        <div className="col-6">
          <button type="submit" className="btn btn-primary w-100" disabled={!isDisabled || isUploadDisabled}>Upload</button>
        </div>
        <div className="col-6">
          <button type="button" onClick={handleDelete} className="btn btn-primary w-100" disabled={isDisabled}>Delete Picture</button>
        </div>
        <div className="col-6">
          <button type="button" onClick={handleTester} className="btn btn-primary w-100">tester</button>
        </div>
        <div className="col-6">
          <button type="button" onClick={handleSubmit} className="btn btn-primary w-100">upload-profile-picture</button>
        </div>
      </form>
    </>
  )
}

export default FileUploader