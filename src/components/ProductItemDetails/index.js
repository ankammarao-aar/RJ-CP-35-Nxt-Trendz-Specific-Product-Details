// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItem: '',
    similarProductList: [],
    counter: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProductItemData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const updatedSimilarData = data.similar_products.map(eachSimilar => ({
        id: eachSimilar.id,
        imageUrl: eachSimilar.image_url,
        title: eachSimilar.title,
        style: eachSimilar.style,
        price: eachSimilar.price,
        description: eachSimilar.description,
        brand: eachSimilar.brand,
        totalReviews: eachSimilar.total_reviews,
        rating: eachSimilar.rating,
        availability: eachSimilar.availability,
      }))
      this.setState({
        productItem: updatedProductItemData,
        similarProductList: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({
      counter: prevState.counter + 1,
    }))
  }

  onClickMinus = () => {
    const {counter} = this.state
    if (counter > 1) {
      this.setState(prevState => ({
        counter: prevState.counter - 1,
      }))
    }
  }

  renderProductItemDetails = () => {
    const {productItem, counter, similarProductList} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItem
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          <img
            src={imageUrl}
            alt="product"
            className="product-item-details-img"
          />
          <div className="product-item-img-details-card">
            <h1 className="product-item-detail-heading">{title}</h1>
            <p className="product-item-details-price">Rs {price}/-</p>
            <div className="product-rating-card">
              <p className="product-item-rating">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="product-star-img"
                />
              </p>
              <p className="product-item-total-reviews">
                {totalReviews} Reviews
              </p>
            </div>
            <p className="product-item-description">{description}</p>
            <p className="product-item-availability">
              <span className="span-brand">Available: </span>
              {availability}
            </p>
            <p className="product-item-brand">
              <span className="span-brand">Brand: </span>
              {brand}
            </p>
            <hr className="product-ling" />
            <div className="product-item-no-card">
              <button
                type="button"
                className="minus"
                onClick={this.onClickMinus}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="count-number">{counter}</p>
              <button
                type="button"
                className="plus"
                onClick={this.onClickPlus}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>

        <div>
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-product-container">
            {similarProductList.map(eachSimilarItem => (
              <SimilarProductItem
                key={eachSimilarItem.id}
                similarItemDetails={eachSimilarItem}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <>
      <Header />

      <div className="product-item-details-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view-img"
        />
        <h1 className="product-details-not-head">Product Not Found</h1>
        <Link to="/products">
          <button type="button" className="shopping-button">
            Continue Shopping
          </button>
        </Link>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="product-loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductItemDetailsSwitch = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div>{this.renderProductItemDetailsSwitch()}</div>
      </>
    )
  }
}

export default ProductItemDetails
