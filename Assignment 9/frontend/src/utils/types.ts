export interface Product {
  id: number
  name: string
  description: string
  price: number
  discount: number
  images: string[]
  ratingAverage: number
  numberOfRatings: number
  sellerName: string
  category: string
  quantity?: number
}

export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  cart?: Record<number, number>
}
