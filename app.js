const express = require('express')
const app = express()
const port = process.env.port || 3000
console.log(`App name = ${process.env.APP_NAME}`)
console.log(`Title = ${process.env.title}`)

app.use(express.urlencoded({extended: false}))

//API for the client (browser)
app.get('/users', (req, res) => {
    res.send('All the users')
})

app.post('/createUser', (req, res => {
    res.send('New user created')
}))

app.listen(port, () => {
    console.log(`App listening on port ${ort}`)
})