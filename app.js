const express = require('express')
const app = express()
const db = require('./db') // This isn't something we install, it's something we write.
const port = process.env.PORT || 3000


app.use(express.urlencoded({extended: false}))

//API for the client (browser)
app.get('/', db.getUsers)

app.post('/createUser', db.createUser)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});