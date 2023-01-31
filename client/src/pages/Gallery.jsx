import { useEffect, useState } from "react"
import GalleryCard from "../components/gallery-card"
import Loading from "../components/loading"
import axios from 'axios'

const Gallery = (props) => {
  const [galleryElements, setGalleryElement] = useState([])
  const [isLoading, setIsLoading] = useState(null)

  const populateGallery = async () => {
   try {
    setIsLoading(true)
    const res = await axios.get("/api/gallery", {
      headers: {
        "X-Access-Token": window.localStorage.getItem("react-context-jwt"),
      },
    })
    const galleryData = res.data;
    setGalleryElement(galleryData);
    setIsLoading(false);
   } catch(err) {
    console.error(err)
   }
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

