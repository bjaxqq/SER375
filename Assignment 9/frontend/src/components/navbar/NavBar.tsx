"use client"

import type React from "react"

import { Link, useNavigate } from "react-router-dom"
import styles from "./NavBar.module.css"
import amazonLogo from "../../assets/amazon-logo.webp"
import { useEffect, useState, useRef } from "react"
import { getUser, getCart } from "../../utils/api"
import type { User } from "../../utils/types"
import { Search, ShoppingCart, Menu, ChevronDown } from "lucide-react"

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  async function loadUser() {
    try {
      const user = await getUser(localStorage.getItem("TOKEN")!)
      setUser(user)
    } catch (error) {
      console.error("Error loading user:", error)
    }
  }

  async function loadCartCount() {
    try {
      const token = localStorage.getItem("TOKEN")
      if (!token) return

      const cartItems = await getCart(token)
      const totalQuantity = cartItems.reduce((total, item) => {
        return total + (item.quantity || 1)
      }, 0)
      setCartCount(totalQuantity)
    } catch (error) {
      console.error("Error loading cart count:", error)
    }
  }

  const handleStorageEvent = () => {
    const token = localStorage.getItem("TOKEN")
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartCount()
    }

    window.addEventListener("storage", handleStorageEvent)
    window.addEventListener("cartUpdated", handleCartUpdate)

    const token = localStorage.getItem("TOKEN")
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }

    return () => {
      window.removeEventListener("storage", handleStorageEvent)
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadUser()
      loadCartCount()
    } else {
      setUser(null)
      setCartCount(0)
    }
  }, [isLoggedIn])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function logout() {
    localStorage.removeItem("TOKEN")
    window.dispatchEvent(new Event("storage"))
    setIsLoggedIn(false)
    navigate("/")
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    console.log("Search for:", searchQuery)
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarTop}>
        <Link to="/" className={styles.logoContainer}>
          <img className={styles.logo} src={amazonLogo || "/placeholder.svg"} alt="Amazon Logo" />
        </Link>

        <div className={styles.deliveryLocation}>
          <div className={styles.deliveryIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div className={styles.deliveryText}>
            <span className={styles.deliveryGreeting}>Deliver to</span>
            <span className={styles.deliveryLocation}>United States</span>
          </div>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchContainer}>
            <div className={styles.searchCategoryContainer}>
              <select className={styles.searchCategory}>
                <option>All</option>
                <option>Electronics</option>
                <option>Computers</option>
                <option>Home</option>
              </select>
            </div>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              <Search size={20} />
            </button>
          </div>
        </form>

        <div className={styles.navItems}>
          {!isLoggedIn ? (
            <Link to="/login" className={styles.navItem}>
              <div className={styles.navItemLine1}>Hello, sign in</div>
              <div className={styles.navItemLine2}>
                Account & Lists <ChevronDown size={12} className={styles.dropdownIcon} />
              </div>
            </Link>
          ) : (
            <div
              className={styles.navItem}
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              ref={accountDropdownRef}
            >
              <div className={styles.navItemLine1}>Hello, {user?.firstName || "User"}</div>
              <div className={styles.navItemLine2}>
                Account & Lists <ChevronDown size={12} className={styles.dropdownIcon} />
              </div>
              {showAccountDropdown && (
                <div className={styles.accountDropdown}>
                  <div className={styles.accountDropdownHeader}>
                    <Link to="/login" className={styles.signInButton}>
                      {isLoggedIn ? "Your Account" : "Sign in"}
                    </Link>
                  </div>
                  <div className={styles.accountDropdownContent}>
                    <div className={styles.accountDropdownSection}>
                      <h4>Your Account</h4>
                      <ul>
                        <li>
                          <Link to="/account">Account</Link>
                        </li>
                        <li>
                          <Link to="/orders">Orders</Link>
                        </li>
                        <li>
                          <Link to="/recommendations">Recommendations</Link>
                        </li>
                        <li>
                          <Link to="/browsing-history">Browsing History</Link>
                        </li>
                      </ul>
                    </div>
                    {isLoggedIn && (
                      <div className={styles.accountDropdownFooter}>
                        <button onClick={logout} className={styles.signOutButton}>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <Link to="/orders" className={styles.navItem}>
            <div className={styles.navItemLine1}>Returns</div>
            <div className={styles.navItemLine2}>& Orders</div>
          </Link>

          <Link to="/cart" className={styles.navItemCart}>
            <div className={styles.cartIconContainer}>
              <ShoppingCart size={28} />
              <span className={styles.cartCount}>{cartCount}</span>
            </div>
            <div className={styles.cartText}>Cart</div>
          </Link>
        </div>
      </div>

      <div className={styles.navbarBottom}>
        <div className={styles.menuIcon}>
          <Menu size={20} />
          <span>All</span>
        </div>
        <div className={styles.navbarLinks}>
          <Link to="/" className={styles.navbarLink}>
            Today's Deals
          </Link>
          <Link to="/" className={styles.navbarLink}>
            Customer Service
          </Link>
          <Link to="/" className={styles.navbarLink}>
            Registry
          </Link>
          <Link to="/" className={styles.navbarLink}>
            Gift Cards
          </Link>
          <Link to="/" className={styles.navbarLink}>
            Sell
          </Link>
        </div>
      </div>
    </div>
  )
}
