// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarItemDetails} = props
  const {imageUrl, title, price, brand, rating} = similarItemDetails
  console.log(similarItemDetails)
  return (
    <li className="similar-list-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <p className="similar-title">{title}</p>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-price-rating-card">
        <p className="similar-price">Rs {price}/-</p>
        <p className="similar-rating">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="product-star-img"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
