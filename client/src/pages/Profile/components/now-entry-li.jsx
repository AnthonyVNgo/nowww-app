// Components 
import CategoryIcons from "../../../lib/category-icons"
import NowEntryLIPlaceholder from "../components/placeholder/now-entry-li-placeholder"

const NowEntryLI = (props) => {
  const categoryId = props.categoryId
  const content = props.content
  const isLoading = props.isLoading

  if (isLoading) {
    return (
      <NowEntryLIPlaceholder />
    )
  }

  return (
    <li className="row align-items-center justify-content-between border rounded py-3 my-2">
      <div className="col-3">
        <CategoryIcons categoryId={categoryId} />
      </div>
      <div className="col-9">
        <span className="text-break">{content}</span>
      </div>
    </li>
  )
}

export default NowEntryLI
