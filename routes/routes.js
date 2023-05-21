const userControllers = require('../controllers/userControllers')
const express = require('express')

exports.router =(() => {

    const userRouter = express.Router()

    userRouter.route('/user').post(userControllers.addUser)
    userRouter.route('/login').post(userControllers.login)
    userRouter.route('/users').get(userControllers.allUsers)
    userRouter.route('/user/:id').get(userControllers.user)
    userRouter.route('/user/:id').put(userControllers.updateUser)
    userRouter.route('/user/:id').delete(userControllers.deleteUser)
    return userRouter
})()