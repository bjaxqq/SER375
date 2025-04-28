"use client"

import { useEffect, useState } from "react"
import styles from "./Browse.module.css"
import type { Product } from "../utils/types"
import { getProducts } from "../utils/api"
import ProductCard from "../components/product-card/ProductCard"
import { ChevronRight } from "lucide-react"
import LoadingSpinner from "../components/loading-spinner/LoadingSpinner"

export default function Browse() {
  const [products, setProducts] = useState([] as Product[])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  async function loadProducts() {
    try {
      setLoading(true)
      const productApiData = await getProducts()
      setProducts(productApiData)
      setLoading(false)
    } catch (error) {
      console.error("Error loading products:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = "Amazon - Browse Products"
    loadProducts()
  }, [])

  const categories = ["all", ...new Set(products.map((product) => product.category.toLowerCase()))]

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category.toLowerCase() === selectedCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return a.price - b.price
      case "priceHigh":
        return b.price - a.price
      case "rating":
        return b.ratingAverage - a.ratingAverage
      default:
        return 0
    }
  })

  function createProductCards() {
    return sortedProducts.map((product) => {
      return (
        <div key={product.id} className={styles.productCardWrapper}>
          <ProductCard
            id={product.id}
            name={product.name}
            imageUrl={product.images[0]}
            ratingAverage={product.ratingAverage}
            price={product.price}
            discount={product.discount}
            numberOfRatings={product.numberOfRatings}
            sellerName={product.sellerName}
          />
        </div>
      )
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.browseHeader}>
        <div className={styles.breadcrumbs}>
          <span>Home</span>
          <ChevronRight size={14} />
          <span>All Products</span>
          {selectedCategory !== "all" && (
            <>
              <ChevronRight size={14} />
              <span className={styles.categoryBreadcrumb}>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </span>
            </>
          )}
        </div>
        <h1>Browse Products</h1>
      </div>

      <div className={styles.browseContent}>
        <div className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>Department</h3>
            <ul className={styles.categoryList}>
              {categories.map((category) => (
                <li key={category} className={selectedCategory === category ? styles.selectedCategory : ""}>
                  <button onClick={() => setSelectedCategory(category)}>
                    {category === "all" ? "All Departments" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterSection}>
            <h3>Customer Review</h3>
            <div className={styles.ratingFilter}>
              <button className={styles.ratingButton}>
                <div className={styles.stars}>★★★★★</div>
                <span>& Up</span>
              </button>
              <button className={styles.ratingButton}>
                <div className={styles.stars}>★★★★☆</div>
                <span>& Up</span>
              </button>
              <button className={styles.ratingButton}>
                <div className={styles.stars}>★★★☆☆</div>
                <span>& Up</span>
              </button>
              <button className={styles.ratingButton}>
                <div className={styles.stars}>★★☆☆☆</div>
                <span>& Up</span>
              </button>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Price</h3>
            <ul className={styles.priceList}>
              <li>
                <button>Under $25</button>
              </li>
              <li>
                <button>$25 to $50</button>
              </li>
              <li>
                <button>$50 to $100</button>
              </li>
              <li>
                <button>$100 to $200</button>
              </li>
              <li>
                <button>$200 & Above</button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.productSection}>
          <div className={styles.productHeader}>
            <p className={styles.numberOfShopItems}>
              {filteredProducts.length} results {selectedCategory !== "all" && `in "${selectedCategory}"`}
            </p>
            <div className={styles.sortContainer}>
              <label htmlFor="sort-select">Sort by: </label>
              <select
                id="sort-select"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
            </div>
          </div>
          <div className={styles.productList}>{createProductCards()}</div>
        </div>
      </div>
    </div>
  )
}
