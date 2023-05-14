const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER ,
    password : process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    console.log(req.body)

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const passwordConfirm = req.body.passwordConfirm
    
    const { name, email, password, passwordConfirm } = req.body
    
    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
        if(error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password do not match'
            })
        }
    })

    res.send('Form submitted')
}