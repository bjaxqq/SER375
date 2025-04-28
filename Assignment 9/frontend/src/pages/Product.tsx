"use client"

import { useNavigate, useParams } from "react-router-dom"
import styles from "./Product.module.css"
import type { Product as ProductType } from "../utils/types"
import { useEffect, useState } from "react"
import { getProductById, addToCart, getProducts } from "../utils/api"
import StarRating from "../components/star-rating/StarRating"
import LoadingSpinner from "../components/loading-spinner/LoadingSpinner"
import { wait } from "../utils/utils"
import ImagePreviewTool from "../components/image-preview-tool/ImagePreviewTool"
import { ShoppingCart, Heart, Shield, Truck, RotateCcw } from "lucide-react"
import ProductCard from "../components/product-card/ProductCard"

export default function Product() {
  const idParam = useParams().id!
  const id = Number.parseInt(idParam, 10)
  const navigate = useNavigate()

  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([])

  async function loadProduct() {
    try {
      setLoading(true)
      const productApiData = await getProductById(id)
      await wait(500)
      setProduct(productApiData)
      document.title = `Amazon.com: ${productApiData.name}`

      const allProducts = await getProducts()
      const related = allProducts
        .filter((p) => p.category === productApiData.category && p.id !== productApiData.id)
        .slice(0, 4)
      setRelatedProducts(related)

      setLoading(false)
    } catch (err) {
      console.error("Error loading product:", err)
      navigate("/")
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const handleAddToCart = async () => {
    const token = localStorage.getItem("TOKEN")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      setIsAddingToCart(true)

      await addToCart(token, id, quantity)

      window.dispatchEvent(new CustomEvent("cartUpdated"))
      navigate("/cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const calculatePrice = (product: ProductType) => {
    if (product.discount === 0) {
      return product.price
    }
    return product.price - product.price * (product.discount / 100)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const discountedPrice = calculatePrice(product)

  return (
    <div className={styles.productPage}>
      <div className={styles.productContainer}>
        <div className={styles.productImageSection}>
          <ImagePreviewTool imageUrls={product.images} />
        </div>

        <div className={styles.productInfoSection}>
          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.productBrand}>
            <a href="#">Visit the {product.sellerName} Store</a>
          </div>

          <div className={styles.ratingContainer}>
            <StarRating rating={product.ratingAverage} />
            <a href="#reviews" className={styles.ratingCount}>
              {product.numberOfRatings.toLocaleString()} ratings
            </a>
          </div>

          <div className={styles.priceSection}>
            {product.discount > 0 ? (
              <>
                <div className={styles.discountBadge}>-{product.discount}%</div>
                <div className={styles.priceDisplay}>
                  <span className={styles.currencySymbol}>$</span>
                  <span className={styles.wholePart}>{Math.floor(discountedPrice)}</span>
                  <span className={styles.decimalPart}>{(discountedPrice % 1).toFixed(2).substring(1)}</span>
                </div>
                <div className={styles.originalPrice}>
                  List Price: <span className={styles.strikethrough}>${product.price.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className={styles.priceDisplay}>
                <span className={styles.currencySymbol}>$</span>
                <span className={styles.wholePart}>{Math.floor(product.price)}</span>
                <span className={styles.decimalPart}>{(product.price % 1).toFixed(2).substring(1)}</span>
              </div>
            )}
          </div>

          <div className={styles.aboutSection}>
            <h3>About this item</h3>
            <p className={styles.productDescription}>{product.description}</p>
          </div>
        </div>

        <div className={styles.buySection}>
          <div className={styles.buyBox}>
            <div className={styles.buyPrice}>
              <span className={styles.currencySymbol}>$</span>
              <span className={styles.wholePart}>{Math.floor(discountedPrice)}</span>
              <span className={styles.decimalPart}>{(discountedPrice % 1).toFixed(2).substring(1)}</span>
            </div>

            {product.discount > 0 && (
              <div className={styles.savingsInfo}>
                You Save:{" "}
                <span className={styles.savingsAmount}>
                  ${(product.price - discountedPrice).toFixed(2)} ({product.discount}%)
                </span>
              </div>
            )}

            <div className={styles.deliveryInfo}>
              <div className={styles.freeDelivery}>
                <Truck size={16} />
                <span>FREE delivery</span>
              </div>
              <div className={styles.deliveryDate}>
                <span className={styles.bold}>Tomorrow, April 29</span>
              </div>
              <div className={styles.deliveryLocation}>
                <a href="#">Deliver to United States</a>
              </div>
            </div>

            <div className={styles.stockInfo}>
              <span className={styles.inStock}>In Stock</span>
            </div>

            <div className={styles.quantitySelector}>
              <label htmlFor="quantity">Quantity:</label>
              <select id="quantity" value={quantity} onChange={(e) => setQuantity(Number.parseInt(e.target.value))}>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.buyButtons}>
              <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isAddingToCart}>
                <ShoppingCart size={18} />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button className={styles.buyNowButton}>Buy Now</button>
            </div>

            <div className={styles.secureTransaction}>
              <Shield size={16} />
              <span>Secure transaction</span>
            </div>

            <div className={styles.shippingInfo}>
              <div className={styles.shippingDetail}>
                <span className={styles.shippingLabel}>Ships from</span>
                <span>Amazon.com</span>
              </div>
              <div className={styles.shippingDetail}>
                <span className={styles.shippingLabel}>Sold by</span>
                <span>{product.sellerName}</span>
              </div>
              <div className={styles.shippingDetail}>
                <span className={styles.shippingLabel}>Returns</span>
                <div className={styles.returnsInfo}>
                  <RotateCcw size={16} />
                  <span>Returnable until May 31, 2025</span>
                </div>
              </div>
            </div>

            <button className={styles.wishlistButton}>
              <Heart size={16} />
              Add to List
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Products related to this item</h2>
          <div className={styles.relatedProductsList}>
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className={styles.relatedProductCard}>
                <ProductCard
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  imageUrl={relatedProduct.images[0]}
                  ratingAverage={relatedProduct.ratingAverage}
                  price={relatedProduct.price}
                  discount={relatedProduct.discount}
                  numberOfRatings={relatedProduct.numberOfRatings}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
