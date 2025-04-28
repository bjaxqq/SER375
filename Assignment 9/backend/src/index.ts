import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import * as productsData from "./products.js"
import {
  formatAjvValidationErrors,
  getLoginRequestValidator,
  getCartRequestValidator,
  getCartUpdateValidator,
} from "./schema.js"
import { createHash } from "crypto"
import {
  getUserByCredentials,
  getUserById,
  addProductToUserCart,
  getUserCart,
  updateUserCartItemQuantity,
  removeProductFromUserCart,
} from "./users.js"
import { createAuthToken, validateAuthToken } from "./auth.js"
import { InvalidAuthTokenError } from "./errors.js"

dotenv.config()

const app = express()
const port = 3000

const main = async () => {
  await initializeServer()
}

const initializeServer = async () => {
  console.log("Initializing Express Server...")

  // middleware to parse json
  app.use(express.json())

  console.log("Configuring CORS...")
  app.use(
    cors({
      origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    }),
  )

  function logError(err: unknown) {
    if (err instanceof Error) {
      console.error(`${err.message}\n\n${err.stack}`)
    } else {
      console.error(`ERROR: ${err}`)
    }
  }

  console.log("Defining endpoint GET /products")
  app.get("/products", async (req, res): Promise<any> => {
    try {
      const products = await productsData.getAll()
      return res.status(200).json(products)
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to get all products due to interal server error" })
    }
  })

  console.log("Defining endpoint GET /products/:id")
  app.get("/products/:id", async (req, res): Promise<any> => {
    try {
      const id = Number.parseInt(req.params.id, 10)
      const product = await productsData.getById(id)
      if (!product) {
        return res.status(404).json({ error: `Product with id ${id} not found` })
      }
      return res.status(200).json(product)
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to get product due to interal server error" })
    }
  })

  interface LoginRequestBody {
    username: string
    password: string
  }

  interface TokenPayload {
    id: number
  }

  console.log("Defining endpoint POST /login")
  app.post("/login", async (req, res): Promise<any> => {
    try {
      const validator = getLoginRequestValidator()
      if (!validator(req.body)) {
        return res
          .status(400)
          .json({ error: "malformed/invalid request body", message: formatAjvValidationErrors(validator.errors) })
      }
      const body = req.body as LoginRequestBody
      const passwordHash = createHash("sha256").update(body.password).digest("hex")
      const user = await getUserByCredentials(body.username, passwordHash)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      const authToken = createAuthToken<TokenPayload>({ id: user.id })
      return res.status(201).json({ token: authToken })
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to complete login due to interal server error" })
    }
  })

  console.log("Defining endpoint GET /user")
  app.get("/user", async (req, res): Promise<any> => {
    try {
      if (!req.headers.token) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      const token = req.headers.token as string
      const payload = validateAuthToken<TokenPayload>(token)
      const user = await getUserById(payload.id)
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      const userResponse = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      return res.status(200).json(userResponse)
    } catch (err: unknown) {
      if (err instanceof InvalidAuthTokenError) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      logError(err)
      return res.status(500).json({ error: "Unable to get user info due to interal server error" })
    }
  })

  interface CartRequestBody {
    productId: number
    quantity?: number
  }

  interface CartUpdateBody {
    productId: number
    quantity: number
  }

  console.log("Defining endpoint POST /cart")
  app.post("/cart", async (req, res): Promise<any> => {
    try {
      if (!req.headers.token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const token = req.headers.token as string
      let payload: TokenPayload

      try {
        payload = validateAuthToken<TokenPayload>(token)
      } catch (err) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const validator = getCartRequestValidator()
      if (!validator(req.body)) {
        return res.status(400).json({
          error: "malformed/invalid request body",
          message: formatAjvValidationErrors(validator.errors),
        })
      }

      const body = req.body as CartRequestBody
      const quantity = body.quantity || 1

      const product = await productsData.getById(body.productId)
      if (!product) {
        return res.status(404).json({ error: `Product with id ${body.productId} not found` })
      }

      try {
        await addProductToUserCart(payload.id, body.productId, quantity)
        return res.status(201).json({ message: "Product added to cart successfully" })
      } catch (err) {
        if (err instanceof Error && err.message.includes("already in the user's cart")) {
          await updateUserCartItemQuantity(payload.id, body.productId, quantity, true)
          return res.status(200).json({ message: "Product quantity updated successfully" })
        }
        throw err
      }
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to add product to cart due to internal server error" })
    }
  })

  console.log("Defining endpoint PUT /cart")
  app.put("/cart", async (req, res): Promise<any> => {
    try {
      if (!req.headers.token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const token = req.headers.token as string
      let payload: TokenPayload

      try {
        payload = validateAuthToken<TokenPayload>(token)
      } catch (err) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const validator = getCartUpdateValidator()
      if (!validator(req.body)) {
        return res.status(400).json({
          error: "malformed/invalid request body",
          message: formatAjvValidationErrors(validator.errors),
        })
      }

      const body = req.body as CartUpdateBody

      await updateUserCartItemQuantity(payload.id, body.productId, body.quantity)
      return res.status(200).json({ message: "Cart item quantity updated successfully" })
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to update cart item due to internal server error" })
    }
  })

  console.log("Defining endpoint DELETE /cart/:productId")
  app.delete("/cart/:productId", async (req, res): Promise<any> => {
    try {
      if (!req.headers.token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const token = req.headers.token as string
      let payload: TokenPayload

      try {
        payload = validateAuthToken<TokenPayload>(token)
      } catch (err) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const productId = Number.parseInt(req.params.productId, 10)
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" })
      }

      await removeProductFromUserCart(payload.id, productId)
      return res.status(200).json({ message: "Product removed from cart successfully" })
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to remove product from cart due to internal server error" })
    }
  })

  console.log("Defining endpoint GET /cart")
  app.get("/cart", async (req, res): Promise<any> => {
    try {
      if (!req.headers.token) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const token = req.headers.token as string
      let payload: TokenPayload

      try {
        payload = validateAuthToken<TokenPayload>(token)
      } catch (err) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const userCart = await getUserCart(payload.id)

      const cartProducts = await Promise.all(
        Object.entries(userCart).map(async ([productId, quantity]) => {
          const product = await productsData.getById(Number.parseInt(productId, 10))
          if (product) {
            return { ...product, quantity }
          }
          return null
        }),
      )

      const validCartProducts = cartProducts.filter((product) => product !== null)

      return res.status(200).json(validCartProducts)
    } catch (err: unknown) {
      logError(err)
      return res.status(500).json({ error: "Unable to get cart due to internal server error" })
    }
  })

  // start express server
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  console.log("Express Server Initialized!")
}

main()
