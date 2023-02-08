const editProfileInput = (props) => {
  const label = props.label

  return (
    <div className="mb-3 row">
    <label htmlFor="tagline" className="col-3 col-form-label">{label}</label>
    <div className="col-9">
      <input 
        type="text" 
        className="form-control-plaintext border-bottom" 
        id={label} 
        name={label}
        placeholder={label}
        value={tagline}
        maxLength={60}
        onChange={e => {setTagline(e.target.value); setInputValue({...inputValue, tagline: e.target.value}) }}
        />
    </div>
  </div>
  )
}

export default editProfileInput