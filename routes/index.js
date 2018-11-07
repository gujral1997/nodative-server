import express from 'express'
const router = express.Router()

import userRoutes from './users'

// Get Homepage
router.use('/user', userRoutes)

export default router