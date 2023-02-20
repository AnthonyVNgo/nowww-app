import { useState } from "react"
import NowInputFormPlaceholder from "./placeholder/now-input-form-placeholder"
import Axios from 'axios'

const NowInputForm = (props) => {
  const entryId = props.entryId
  const getEntries = props.getEntries
  const inputIsDisabled = props.entryCount >= 10 ? true : false
  const placeholderMessage = props.entryCount >= 10 ? 'Entry Limit Reached' : 'Add an entry'
  const isLoading = props.isLoading
  
  const [input, setInput] = useState(props.content)
  const [category, setCategory] = useState(props.categoryId)

  const handleChange = (event) => {
    setInput(event.target.value)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  }

  const clearInput = () => {
    setInput('')
  }

  const clearSelect = () => {
    setCategory(null)
  }

  const addEntry = async () => {
    try {
      await Axios.post('/api/add-entry', {input, category}, {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt')
        }
      })
      clearInput()
      clearSelect()
      getEntries()
    } catch(err) {
      console.error(err)
    }
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    addEntry()
  }

  let deletePath = `/api/delete-entry/${entryId}`

  const deleteEntry = async () => {
    await Axios.delete(deletePath, {
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt')
      }
    })
    getEntries()
  }

  const handleDeleteButton = () => {
    deleteEntry()
  }

  let updatePath = `/api/edit-entry/${entryId}`

  const updateEntry = async () => {
    try {
      await Axios.put(updatePath, {input, category}, {
        headers: {
          'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 'Content-Type': 'application/json'  
        }
      })
      getEntries()
    } catch(err) {
      console.error(err)
    }
  }

  const handleUpdate = (event) => {
    event.preventDefault()
    updateEntry()
  }

  if (isLoading) {
    return (
      <NowInputFormPlaceholder />
    )
  }

  return ( 
    <div className="d-flex my-2 py-2">
      <form className="w-100" onSubmit={props.isLi ? handleUpdate : handleSubmit}>
        <div className="row flex-row-reverse m-0 w-100">

          <div className="col-12 col-xl-10 p-0">
            <input 
              className="form-control rounded-0 rounded-end" 
              type="text" 
              value={input} 
              onChange={handleChange} 
              placeholder={placeholderMessage} 
              disabled={inputIsDisabled}
              maxLength="120"
              required
              aria-label="entry" 
              aria-describedby="basic-addon1"
            ></input>
          </div>

          <div className="col-12 col-xl-2 p-0">
            <select 
              value={category} 
              className="form-select rounded-0 rounded-start"
              onChange={handleCategoryChange}
              disabled={inputIsDisabled}
              >
              <option value={null}>Select</option>
              <option value="1">Career</option>
              <option value="2">Hobbies</option>
              <option value="3">Learning</option>
              <option value="4">Reading</option>
              <option value="5">Health</option>
              <option value="6">Personal</option>
              <option value="7">Wanted</option>
              <option value="8">Wisdom</option>
              <option value="9">Misc</option>
            </select>
          </div>
        </div>

            {!props.isLi 
              ?
              <div className="pt-1">
                <button disabled={inputIsDisabled} type="submit" className="btn btn-primary w-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                  </svg>
                </button>
              </div>
              : null
            }

            {props.isLi 
            ? 
            <div>
              <button className="btn w-100" onClick={handleDeleteButton} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </button>
            </div>
            : null
          } 
          
      </form>
    </div>
  )
}

export default NowInputForm