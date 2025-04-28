"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCart, updateCartItemQuantity, removeFromCart } from "../utils/api"
import type { Product } from "../utils/types"
import LoadingSpinner from "../components/loading-spinner/LoadingSpinner"
import styles from "./Cart.module.css"
import { Trash2 } from "lucide-react"

interface CartItem extends Product {
  quantity: number
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function loadCart() {
    try {
      const token = localStorage.getItem("TOKEN")
      if (!token) {
        navigate("/login")
        return
      }

      setLoading(true)
      const cartData = await getCart(token)
      setCartItems(cartData)
      setLoading(false)
    } catch (error) {
      console.error("Error loading cart:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = "Amazon - Your Cart"

    const token = localStorage.getItem("TOKEN")
    if (!token) {
      navigate("/login")
      return
    }

    loadCart()
  }, [navigate])

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return

    try {
      const token = localStorage.getItem("TOKEN")
      if (!token) {
        navigate("/login")
        return
      }

      setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))

      await updateCartItemQuantity(token, productId, newQuantity)

      window.dispatchEvent(new CustomEvent("cartUpdated"))
    } catch (error) {
      console.error("Error updating quantity:", error)
      loadCart()
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      const token = localStorage.getItem("TOKEN")
      if (!token) {
        navigate("/login")
        return
      }

      setCartItems((prev) => prev.filter((item) => item.id !== productId))

      await removeFromCart(token, productId)

      window.dispatchEvent(new CustomEvent("cartUpdated"))
    } catch (error) {
      console.error("Error removing item:", error)
      loadCart()
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount ? item.price - item.price * (item.discount / 100) : item.price
      return total + price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <div className={styles.cartContent}>
          <div className={styles.cartHeader}>
            <h1>Shopping Cart</h1>
            <button className={styles.deselect}>Deselect all items</button>
          </div>

          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <h2>Your Amazon Cart is empty</h2>
              <p>
                Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies,
                electronics, and more.
              </p>
              <button className={styles.continueShoppingButton} onClick={() => navigate("/")}>
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              <div className={styles.priceHeader}>Price</div>

              <div className={styles.cartItems}>
                {cartItems.map((item) => {
                  const price = item.discount ? item.price - item.price * (item.discount / 100) : item.price

                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        <img src={item.images[0] || "/placeholder.svg"} alt={item.name} />
                      </div>

                      <div className={styles.itemDetails}>
                        <div className={styles.itemTitle}>
                          <a href={`/product/${item.id}`}>{item.name}</a>
                        </div>

                        <div className={styles.itemStock}>In Stock</div>

                        <div className={styles.itemSeller}>Sold by: {item.sellerName}</div>

                        <div className={styles.itemActions}>
                          <div className={styles.quantitySelector}>
                            <select
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                              className={styles.quantitySelect}
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  Qty: {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className={styles.actionDivider}>|</div>

                          <button className={styles.deleteButton} onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 size={14} />
                            Delete
                          </button>

                          <div className={styles.actionDivider}>|</div>

                          <button className={styles.saveButton}>Save for later</button>
                        </div>
                      </div>

                      <div className={styles.itemPrice}>${price.toFixed(2)}</div>
                    </div>
                  )
                })}
              </div>

              <div className={styles.cartSubtotal}>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
                <span className={styles.subtotalAmount}>${subtotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.checkoutSection}>
            <div className={styles.subtotalBox}>
              <div className={styles.subtotalHeader}>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
                <span className={styles.subtotalAmount}>${subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.giftOption}>
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>

              <button className={styles.proceedButton}>Proceed to checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
