"use client"

import type React from "react"

import { useState } from "react"
import styles from "./ImagePreviewTool.module.css"

interface ImagePreviewToolProps {
  imageUrls: string[]
}

export default function ImagePreviewTool({ imageUrls }: ImagePreviewToolProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  if (!imageUrls || imageUrls.length === 0) {
    return <div className={styles.noImages}>No images available</div>
  }

  const displayedImageIndex = hoveredImageIndex !== null ? hoveredImageIndex : selectedImageIndex

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setMousePosition({ x, y })
  }

  const handleMainImageMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMainImageMouseLeave = () => {
    setIsZoomed(false)
  }

  return (
    <div className={styles.imagePreviewContainer}>
      <div className={styles.thumbnailsContainer}>
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.selectedThumbnail : ""}`}
            onClick={() => setSelectedImageIndex(index)}
            onMouseEnter={() => setHoveredImageIndex(index)}
            onMouseLeave={() => setHoveredImageIndex(null)}
          >
            <img src={url || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className={styles.thumbnailImage} />
          </div>
        ))}
      </div>
      <div
        className={`${styles.mainImageContainer} ${isZoomed ? styles.zooming : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMainImageMouseEnter}
        onMouseLeave={handleMainImageMouseLeave}
      >
        <img
          src={imageUrls[displayedImageIndex] || "/placeholder.svg"}
          alt="Product"
          className={styles.mainImage}
          style={
            isZoomed
              ? {
                  transform: "scale(2)",
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }
              : undefined
          }
        />
        {isZoomed && (
          <div className={styles.zoomInstructions}>
            <span>Move cursor to zoom</span>
          </div>
        )}
      </div>
    </div>
  )
}
