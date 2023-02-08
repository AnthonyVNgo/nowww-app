import { useContext } from "react"
import Axios from 'axios'

// Lib 
import AppContext from "../lib/app-context"

const ModalDialog = () => {
  const { handleLogOut } = useContext(AppContext)

  const deleteAllEntries = async () => {
    try {
      await Axios.delete('/api/delete-all-entries', {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 
        }
      })
    } catch(err) {
      console.error(err)
    }
  }

  const deleteProfilePicture = async () => {
    try {
      await Axios.delete('/api/delete-profile-picture', {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'),
        }
      })
    } catch(err) {
      console.error(err)
    }
  }

  const deleteUser = async () => {
    try {
      await Axios.delete('/api/delete-profile', {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 
        }
      })
    } catch(err) {
      console.error(err)
    }
  }

  const handleDeleteButton = () => {
    deleteAllEntries()
    deleteProfilePicture()
    deleteUser()
    handleLogOut()
  }

  return ( 
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Delete Profile?</h5>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button onClick={handleDeleteButton} type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDialog