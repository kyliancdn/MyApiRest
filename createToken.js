const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path:'./.env' })


module.exports = {
    generateToken : (user) => {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

        return jwt.sign(payload, process.env.JWT_SECRET, options)
    },
    verifyToken : (req, res, next) => {
        const token = req.headers.authorization

        if(!token) {
            return res.status(401).json({ error: 'Access denied. Token missing.' })
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: 'Invalid token.'})
            }
                req.user = decoded
                next()
        })
    }
}