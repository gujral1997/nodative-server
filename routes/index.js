import express from 'express'
const router = express.Router()

import userRoutes from './users'

router.get('/', function(req, res){
	res.render('index');
});

// Get Homepage
router.use('/user', userRoutes)

export default router