import Ajv, { type ErrorObject } from "ajv"

function createValidator(schema: object) {
  const ajv = new Ajv()
  return ajv.compile(schema)
}

export function getLoginRequestValidator() {
  const schema = {
    type: "object",
    properties: {
      username: {
        type: "string",
        minLength: 1,
      },
      password: {
        type: "string",
        minLength: 1,
      },
    },
    required: ["username", "password"],
    additionalProperties: false,
  }
  return createValidator(schema)
}

export function getCartRequestValidator() {
  const schema = {
    type: "object",
    properties: {
      productId: {
        type: "number",
        minimum: 1,
      },
      quantity: {
        type: "number",
        minimum: 1,
        maximum: 10,
      },
    },
    required: ["productId"], // Only productId is required, quantity is optional
    additionalProperties: false,
  }
  return createValidator(schema)
}

export function getCartUpdateValidator() {
  const schema = {
    type: "object",
    properties: {
      productId: {
        type: "number",
        minimum: 1,
      },
      quantity: {
        type: "number",
        minimum: 1,
        maximum: 10,
      },
    },
    required: ["productId", "quantity"],
    additionalProperties: false,
  }
  return createValidator(schema)
}

type AjvValidatorError = ErrorObject<string, Record<string, any>, unknown>[] | null | undefined

export function formatAjvValidationErrors(errors: AjvValidatorError) {
  const ajv = new Ajv()
  return ajv.errorsText(errors, { separator: "\n" })
}
