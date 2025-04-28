"use client"

import type React from "react"
import { useState } from "react"
import StarRating from "../star-rating/StarRating"
import { Link, useNavigate } from "react-router-dom"
import styles from "./ProductCard.module.css"
import { addToCart } from "../../utils/api"
import { ShoppingCart, Heart } from "lucide-react"

export interface ProductCardProps {
  id: number
  name: string
  imageUrl: string
  ratingAverage: number
  price: number
  discount?: number
  numberOfRatings?: number
  showAddToCart?: boolean
  sellerName?: string
}

export default function ProductCard(props: ProductCardProps) {
  const navigate = useNavigate()
  const { showAddToCart = true } = props
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const token = localStorage.getItem("TOKEN")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      setIsAddingToCart(true)
      await addToCart(token, props.id, 1)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)

      window.dispatchEvent(new CustomEvent("cartUpdated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const calculateDiscountedPrice = () => {
    if (!props.discount) return props.price
    return props.price - props.price * (props.discount / 100)
  }

  const discountedPrice = calculateDiscountedPrice()

  return (
    <div
      className={styles.productContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.productImageContainer}>
        <Link to={`/product/${props.id}`}>
          <img className={styles.productImage} src={props.imageUrl || "/placeholder.svg"} alt={props.name} />
        </Link>
        {isHovered && showAddToCart && (
          <button
            className={`${styles.quickAddToCartButton} ${isAddingToCart ? styles.loading : ""} ${addedToCart ? styles.added : ""}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {addedToCart ? "Added!" : isAddingToCart ? "Adding..." : "Quick Add"}
          </button>
        )}
      </div>
      <div className={styles.productContent}>
        <Link className={styles.productLink} to={`/product/${props.id}`}>
          <h2 className={styles.productTitle}>{props.name}</h2>
        </Link>

        <div className={styles.ratingContainer}>
          <StarRating rating={props.ratingAverage} />
          {props.numberOfRatings && (
            <span className={styles.ratingCount}>{props.numberOfRatings.toLocaleString()}</span>
          )}
        </div>

        <div className={styles.priceContainer}>
          {props.discount ? (
            <>
              <span className={styles.discountedPrice}>${discountedPrice.toFixed(2)}</span>
              <span className={styles.originalPrice}>${props.price.toFixed(2)}</span>
              <span className={styles.discountBadge}>Save {props.discount}%</span>
            </>
          ) : (
            <span className={styles.price}>${props.price.toFixed(2)}</span>
          )}
        </div>

        {props.sellerName && (
          <div className={styles.sellerInfo}>
            <span>Sold by: {props.sellerName}</span>
          </div>
        )}

        {showAddToCart && (
          <div className={styles.actionButtons}>
            <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isAddingToCart}>
              <ShoppingCart size={16} />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button className={styles.wishlistButton}>
              <Heart size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
