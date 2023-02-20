import { useEffect } from "react"
import GalleryCard from "./components/gallery-card"
import Loading from "../../components/loading"

// Redux 
import { useDispatch, useSelector } from 'react-redux'
import { getGalleryElements } from "../../state/Gallery/gallerySlice"

const Gallery = () => {
  const { galleryElements, isLoading } = useSelector((state) => state.gallery)
  const dispatch = useDispatch()

  useEffect(()=> {
    dispatch(getGalleryElements())
  }, [])

  return (
      isLoading || galleryElements.length === 0 
      ? <Loading />
      :
      <div className="row g-3">
          {galleryElements.map((element)=> (
            <GalleryCard key={element.id} element={element}/>
          ))}
      </div>
  )
}

export default Gallery

