import { loadJsonFromFile, writeFile } from "./utils.js"

export interface User {
  id: number
  username: string
  passwordHash: string
  firstName: string
  lastName: string
  cart: Record<number, number>
}

export async function getUserByCredentials(username: string, passwordHash: string): Promise<User | null> {
  const users = await loadJsonFromFile<User[]>("./data-store/users.json")
  const user = users.find((user) => user.username === username && user.passwordHash === passwordHash)
  if (!user) {
    return null
  }
  return user
}

export async function getUserById(id: number): Promise<User | null> {
  const users = await loadJsonFromFile<User[]>("./data-store/users.json")
  const user = users.find((user) => user.id === id)
  if (!user) {
    return null
  }
  return user
}

export async function addProductToUserCart(userId: number, productId: number, quantity = 1): Promise<void> {
  const users = await loadJsonFromFile<User[]>("./data-store/users.json")
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    throw new Error(`User with id ${userId} not found`)
  }

  if (!users[userIndex].cart) {
    users[userIndex].cart = {}
  }

  if (Array.isArray(users[userIndex].cart)) {
    const oldCart = users[userIndex].cart as unknown as number[]
    const newCart: Record<number, number> = {}
    oldCart.forEach((id) => {
      newCart[id] = (newCart[id] || 0) + 1
    })
    users[userIndex].cart = newCart
  }

  if (users[userIndex].cart[productId]) {
    users[userIndex].cart[productId] += quantity
  } else {
    users[userIndex].cart[productId] = quantity
  }

  await writeFile("./data-store/users.json", JSON.stringify(users, null, 2))
}

export async function updateUserCartItemQuantity(
  userId: number,
  productId: number,
  quantity: number,
  increment = false,
): Promise<void> {
  const users = await loadJsonFromFile<User[]>("./data-store/users.json")
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    throw new Error(`User with id ${userId} not found`)
  }

  if (!users[userIndex].cart) {
    users[userIndex].cart = {}
  }

  if (Array.isArray(users[userIndex].cart)) {
    const oldCart = users[userIndex].cart as unknown as number[]
    const newCart: Record<number, number> = {}
    oldCart.forEach((id) => {
      newCart[id] = (newCart[id] || 0) + 1
    })
    users[userIndex].cart = newCart
  }

  if (increment) {
    users[userIndex].cart[productId] = (users[userIndex].cart[productId] || 0) + quantity
  } else {
    users[userIndex].cart[productId] = quantity
  }

  await writeFile("./data-store/users.json", JSON.stringify(users, null, 2))
}

export async function removeProductFromUserCart(userId: number, productId: number): Promise<void> {
  const users = await loadJsonFromFile<User[]>("./data-store/users.json")
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    throw new Error(`User with id ${userId} not found`)
  }

  if (!users[userIndex].cart) {
    users[userIndex].cart = {}
    return
  }

  if (Array.isArray(users[userIndex].cart)) {
    const oldCart = users[userIndex].cart as unknown as number[]
    const newCart: Record<number, number> = {}
    oldCart.forEach((id) => {
      if (id !== productId) {
        newCart[id] = (newCart[id] || 0) + 1
      }
    })
    users[userIndex].cart = newCart
  } else {
    delete users[userIndex].cart[productId]
  }

  await writeFile("./data-store/users.json", JSON.stringify(users, null, 2))
}

export async function getUserCart(userId: number): Promise<Record<number, number>> {
  const user = await getUserById(userId)
  if (!user) {
    throw new Error(`User with id ${userId} not found`)
  }

  if (!user.cart) {
    return {}
  }

  if (Array.isArray(user.cart)) {
    const oldCart = user.cart as unknown as number[]
    const newCart: Record<number, number> = {}
    oldCart.forEach((id) => {
      newCart[id] = (newCart[id] || 0) + 1
    })
    return newCart
  }

  return user.cart
}
