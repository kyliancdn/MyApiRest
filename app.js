const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('<h3>Salut</h3>')
})

app.listen(5000, () => {
    console.log('yo')
})