const bcrypt = require('bcryptjs')

const generateToken = require('../dbConfig').generateToken
const db = require('../dbConfig')

module.exports = {
    addUser: (req, res) => {
        const { name, password, role, email } = req.body
    
        bcrypt.hash(password, 10, (error, hashedPassword) => {
            if(error) {
                console.log(error)
                res.status(500).json({ error: 'Operation failed' })
            } else {
                const newUser = { name, password: hashedPassword, role, email }
                db.query('INSERT INTO users SET ?', newUser, (error, result) => {
                    if(error) {
                        console.log(error)
                        res.status(500).json({ error: 'Operation failed' })
                    } else {
                        const user = { id: result.insertId, ...newUser }
                        const token = generateToken(user)
                        res.status(201).json({
                            message: 'User created successfully',
                            token: token,
                        })
                    }
                })
            }
        })
    
    
    },
    login: (req, res) => {
        const { email, password } = req.body
      
        db.query("SELECT * FROM users WHERE email = ?", email, (error, results) => {
          if (error) {
            console.log(error)
            res.status(500).json({ error: "Failed to login" })
          } else if (results.length === 0) {
            res.status(401).json({ error: "Invalid email or password" })
          } else {
            const user = results[0]
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) {
                console.log(error)
                res.status(500).json({ error: "Failed to login" })
              } else if (isMatch) {
                const token = generateToken(user)
                res.status(200).json({
                  message: "Login successful",
                  token: token,
                })
              } else {
                res.status(401).json({ error: "Invalid email or password" })
              }
            })
          }
        })
    },
    allUsers: (req, res) => {
        db.query('SELECT * FROM users', (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: 'Failed to retrieve users' })
            } else {
                res.status(200).json(results)
            }
        })
    },
    user: (req, res) => {
        const userId = req.params.id
    
        db.query('SELECT * FROM users WHERE id = ?', userId, (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: 'Failed to retrieve the user'})
            } else if (results.length === 0) {
                res.status(404).json({ error: 'User not found'})
            } else {
                res.status(200).json(results[0])
            }
        })
    }, 
    updateUser: (req, res) => {
        const userId = req.params.id
        const { name, password, role, email} = req.body
        const updatedUser = { name, password, role, email }
    
        db.query(
            'UPDATE users SET ? WHERE id = ?',
            [updatedUser, userId],
            (error, result) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ error: 'Failed to update the user'})
                } else if (result.affectedRows === 0) {
                    res.status(404).json({ error: 'User not found'})
                } else {
                    res.status(200).json({ message: 'User updated successfully'})
                }
            }
        )
    },
    deleteUser: (req, res) => {
        const userId = req.params.id
    
        db.query('DELETE FROM users WHERE id = ?', userId, (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: 'Failed to delete the user'})
            } else if (results.affectedRows === 0) {
                res.status(404).json({ error: 'User not found' })
            } else {
                res.status(200).json({ message: 'User deleted successfully' })
            }
        })
    }
}