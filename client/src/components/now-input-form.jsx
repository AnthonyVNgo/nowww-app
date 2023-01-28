import { useState } from "react"
import NowInputFormPlaceholder from "./now-input-form-placeholder"

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

  const addEntry = () => {
    const options = {
      method: 'POST',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 'Content-Type': 'application/json'
      },
      body: JSON.stringify({input, category})
    };
    fetch('/api/add-entry', options)
      .then(() => {
        clearInput()
        clearSelect()
        getEntries()
      })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    addEntry()
  }

  let deletePath = `/api/delete-entry/${entryId}`
  const deleteEntry = () => {
    let options = {
      method: 'DELETE',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt')
      }
    }
    fetch(deletePath, options)
      .then(() => getEntries())
  }

  const handleDeleteButton = () => {
    deleteEntry()
  }

  let updatePath = `/api/edit-entry/${entryId}`
  const updateEntry = () => {
    const options = {
      method: 'PUT',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt'), 'Content-Type': 'application/json'
      },
      body: JSON.stringify({input, category})
    }
    fetch(updatePath, options)
      .then(() => getEntries())
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
              maxlength="120"
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
              <option selected value={null}>Select</option>
              <option value="1">Career</option>
              <option value="2">Fun & Hobbies</option>
              <option value="3">Learning</option>
              <option value="4">Reading</option>
              <option value="5">Health</option>
              {/* <option value="5">Health & Fitness</option> */}
              <option value="6">Personal</option>
              <option value="7">Wanted</option>
              <option value="8">Wisdom</option>
              <option value="9">Misc</option>
            </select>
          </div>
        </div>

            {!props.isLi && 
              <div className="pt-1">
                <button disabled={inputIsDisabled} type="submit" className="btn btn-primary w-100">+</button>
              </div>
            }

            {props.isLi && 
            <div>
              {/* <button className="btn w-50" onClick={handleUpdateButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
              </button> */}
              {/* <button className="btn w-50" onClick={handleDeleteButton}> */}
              <button className="btn w-100" onClick={handleDeleteButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              </button>
            </div>
          } 
          
      </form>
    </div>
  )
}

export default NowInputForm