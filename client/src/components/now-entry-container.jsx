import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

// Components 
import NowInputForm from "./now-input-form"
import NowEntryLI from "./now-entry-li";

const NowEntryContainer = () => {
  const [entries, setEntries] = useState([])
  let entryCount = entries.length
  
  const [isLoading, setIsLoading] = useState(null)
  
  let location = useLocation().pathname
  let isMyProfile = location === '/my-profile' || location === '/edit-profile' 
    ? true
    : false

  let path = isMyProfile
    ? '/api/my-entries'
    : `/api${location}/entries`

  const getEntries = () => {
    setIsLoading(true)
    let options = {
      method: 'GET',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt')
      }
    }
    fetch(path, options)
      .then(res => res.json())
      .then(entries => {
        setEntries(entries)
        setIsLoading(false)
      })
      .catch(err => {
        console.log('error:', err)
      })
  }

  useEffect(() => {
    getEntries()
  }, [location])

  return (
    <div className="pt-4 placeholder-glow">
      {location === '/edit-profile' && <NowInputForm getEntries={getEntries} entryCount={entryCount} isLoading={isLoading}/>}
      
      {(entries.length !== 0 && location === '/edit-profile') && entries.map((entry)=> (
        <NowInputForm
          key={entry.id} 
          userId={entry.user_id} 
          entryId={entry.id} 
          categoryId={entry.category_id}
          content={entry.content} 
          getEntries={getEntries} 
          isLi={true}
          isLoading={isLoading}
          />
      ))}

      {(location !== '/edit-profile' && isLoading) && 
        <h5 className="mb-3 placeholder col-4" /> 
      }

      {(location !== '/edit-profile' && !isLoading) && 
        <h5 className="mb-3">Nowww Entries</h5>
      }

      {(entries.length === 0 && location !== '/edit-profile' && !isLoading) && 
        <p className="text-muted">There currently are no entries</p>
      }

      {(entries.length !== 0 && location !== '/edit-profile') && entries.map((entry)=> (
        <NowEntryLI 
          key={entry.id} 
          userId={entry.user_id} 
          entryId={entry.id} 
          categoryId={entry.category_id}
          content={entry.content} 
          getEntries={getEntries} 
          isLoading={isLoading}/>
      ))}
    </div>
  )
}

export default NowEntryContainer