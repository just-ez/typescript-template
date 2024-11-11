import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ""
const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY || ""
const TOKEN_DURATION = "30days"
const PORT = process.env.PORT || 3001
const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY
const BASE_URL = process.env.BASE_URL
const PLAN_ID = process.env.PLAN_ID
export {
    MONGODB_URI,
    JWT_SECRETE_KEY,
    TOKEN_DURATION,
    PORT,
    BASE_URL,
    FLW_PUBLIC_KEY,
    FLW_SECRET_KEY,
    PLAN_ID
}