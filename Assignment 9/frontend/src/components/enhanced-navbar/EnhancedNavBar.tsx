"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import styles from "./EnhancedNavBar.module.css"
import amazonLogo from "../../assets/amazon-logo.webp"
import { useEffect, useState } from "react"
import { getCart, getUser } from "../../utils/api"
import type { Product, User } from "../../utils/types"
import { Search, ShoppingCart, MapPin, ChevronDown, Menu } from "lucide-react"

export default function EnhancedNavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const navigate = useNavigate()

  async function loadUser() {
    try {
      const token = localStorage.getItem("TOKEN")
      if (!token) return

      const user = await getUser(token)
      setUser(user)
    } catch (error) {
      console.error("Error loading user:", error)
    }
  }
  async function loadCart() {
    try {
      const token = localStorage.getItem("TOKEN")
      if (!token) return

      const cartData = await getCart(token)
      setCartItems(cartData)

      const totalQuantity = cartData.reduce((total, item) => {
        return total + (item.quantity || 1)
      }, 0)

      setCartCount(totalQuantity)
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  const handleStorageChange = () => {
    if (localStorage.getItem("TOKEN")) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange)
    handleStorageChange()

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadUser()
      loadCart()
    } else {
      setUser(null)
      setCartItems([])
      setCartCount(0)
    }
  }, [isLoggedIn])

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  function logout() {
    localStorage.removeItem("TOKEN")
    window.dispatchEvent(new Event("storage"))
    setIsLoggedIn(false)
    setShowAccountDropdown(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbar}>
        <Link to="/" className={styles.logoContainer}>
          <img className={styles.logo} src={amazonLogo || "/placeholder.svg"} alt="Amazon" />
        </Link>

        <div className={styles.deliveryLocation}>
          <MapPin size={18} />
          <div>
            <div className={styles.deliverTo}>Deliver to</div>
            <div className={styles.location}>United States</div>
          </div>
        </div>

        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <select className={styles.searchCategory}>
            <option>All</option>
            <option>Electronics</option>
            <option>Computers</option>
            <option>Home</option>
          </select>
          <input
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon"
          />
          <button type="submit" className={styles.searchButton}>
            <Search size={20} />
          </button>
        </form>

        <div className={styles.navItems}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.navItem}>
              <div className={styles.navItemTop}>Hello, sign in</div>
              <div className={styles.navItemBottom}>
                Account & Lists <ChevronDown size={12} />
              </div>
            </Link>
          ) : (
            <div
              className={styles.navItem}
              onMouseEnter={() => setShowAccountDropdown(true)}
              onMouseLeave={() => setShowAccountDropdown(false)}
            >
              <div className={styles.navItemTop}>Hello, {user?.firstName || "User"}</div>
              <div className={styles.navItemBottom}>
                Account & Lists <ChevronDown size={12} />
              </div>

              {showAccountDropdown && (
                <div className={styles.accountDropdown}>
                  <div className={styles.dropdownHeader}>
                    <Link to="/login" className={styles.signInButton}>
                      {isLoggedIn ? "Your Account" : "Sign in"}
                    </Link>
                    {!isLoggedIn && (
                      <div className={styles.newCustomer}>
                        New customer? <Link to="/register">Start here</Link>
                      </div>
                    )}
                  </div>

                  <div className={styles.dropdownColumns}>
                    <div className={styles.dropdownColumn}>
                      <h3>Your Lists</h3>
                      <ul>
                        <li>
                          <a href="#">Create a List</a>
                        </li>
                        <li>
                          <a href="#">Find a List or Registry</a>
                        </li>
                        <li>
                          <a href="#">AmazonSmile Charity Lists</a>
                        </li>
                      </ul>
                    </div>

                    <div className={styles.dropdownColumn}>
                      <h3>Your Account</h3>
                      <ul>
                        <li>
                          <a href="#">Account</a>
                        </li>
                        <li>
                          <a href="#">Orders</a>
                        </li>
                        <li>
                          <a href="#">Recommendations</a>
                        </li>
                        <li>
                          <a href="#">Browsing History</a>
                        </li>
                        <li>
                          <a href="#">Watchlist</a>
                        </li>
                        <li>
                          <a href="#">Prime Membership</a>
                        </li>
                        <li>
                          <a href="#">Returns</a>
                        </li>
                        <li>
                          <a href="#">Customer Service</a>
                        </li>
                        {isLoggedIn && (
                          <li>
                            <button onClick={logout} className={styles.signOutButton}>
                              Sign Out
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link to="/orders" className={styles.navItem}>
            <div className={styles.navItemTop}>Returns</div>
            <div className={styles.navItemBottom}>& Orders</div>
          </Link>

          <Link to="/cart" className={styles.cartContainer}>
            <div className={styles.cartIconContainer}>
              <ShoppingCart size={30} />
              <span className={styles.cartCount}>{cartCount}</span>
            </div>
            <span className={styles.cartText}>Cart</span>
          </Link>
        </div>
      </div>

      <div className={styles.subNav}>
        <button className={styles.allButton}>
          <Menu size={18} /> All
        </button>
        <nav className={styles.categories}>
          <a href="#">Today's Deals</a>
          <a href="#">Customer Service</a>
          <a href="#">Registry</a>
          <a href="#">Gift Cards</a>
          <a href="#">Sell</a>
        </nav>
      </div>
    </div>
  )
}
