import { useEffect, useState } from "react"
import GalleryCard from "../components/gallery-card"
import Loading from "../components/loading"

const Gallery = (props) => {
  const [galleryElements, setGalleryElement] = useState([])
  const [isLoading, setIsLoading] = useState(null)

  const populateGallery = () => {
    setIsLoading(true)
    fetch(`http://localhost:5000/gallery`, {
      method: 'GET',
      headers: {
        'X-Access-Token': window.localStorage.getItem('react-context-jwt')
      }
    })
    .then(res => res.json())
    .then(galleryDetails => {
      setGalleryElement(galleryDetails)
      console.log(galleryDetails)
      setIsLoading(false)
    });
  }

  useEffect(()=> {
    populateGallery()
  }, [])

  if (isLoading || galleryElements.length === 0) {
    return (
      <Loading />
    )
  } 
  return (
    <div className="row g-3">
        {galleryElements.map((element)=> (
          <GalleryCard key={element.id} element={element}/>
        ))}
    </div>
  )
}

export default Gallery

