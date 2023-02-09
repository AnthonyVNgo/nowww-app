const editProfileInput = (props) => {
  const inputValue = props.inputValue
  const setInputValue = props.setInputValue
  
  const value = props.value
  const label = props.label

  return (
    <div className="mb-3 row">
    <label htmlFor="tagline" className="col-3 col-form-label">{label}</label>
    <div className="col-9">
      {label === 'bio'
        ? 
        <textarea 
          className="form-control-plaintext border-bottom" 
          id="bio" 
          rows="3"
          placeholder="bio"
          value={value}
          maxLength={280}
          type="text"
          name="bio"
          onChange={e => {setInputValue({...inputValue, [label]: e.target.value})}}
        />
        :
        null
      }
      {label === 'tagline'
        ? 
        <input 
          type="text" 
          className="form-control-plaintext border-bottom" 
          id={label} 
          name={label}
          placeholder={label}
          value={value}
          maxLength={60}
          onChange={e => {setInputValue({...inputValue, [label]: e.target.value}) }}
        />
        : null
      }
      {(label !== 'bio' && label !== 'tagline')
        ?
        <input 
          type="text" 
          className="form-control-plaintext border-bottom" 
          id={label} 
          name={label}
          placeholder={label}
          value={value}
          pattern="[a-zA-Z0-9-]+"
          onChange={e => {setInputValue({...inputValue, [label]: e.target.value})}}
        />
        : null
      }
    </div>
  </div>
  )
}

export default editProfileInput