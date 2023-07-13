const express = require('express')

const {newUser,signIn,verify,forgotPassword,resetPassword,logout} = require('../Controller/controller')
const router = express.Router()
 router.post('/signup',newUser)
 router.put('/verifyLink/:id', verify)
 router.get('/forgot-password',forgotPassword)
 router.put('/reset-password/:id',resetPassword)
 router.get('/logout',logout)
 router.post('/signin',signIn)


module.exports =router







