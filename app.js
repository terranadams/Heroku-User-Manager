const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//api for the client (browser)
app.get('/', db.getUsers); //http://localhost:8080/users
app.get('/user/:id', db.getUserById); //http://localhost:8080/user/2
app.post('/createUser', db.createUser); //curl -d "name=hank&email=hank@example.org" -X POST http://localhost:8080/createUser
app.post('/updateUser', db.updateUser); //curl -d "name=samuel&id=2" -X POST http://localhost:8080/updateUser
app.get('/deleteUser/:id', db.deleteUser); //curl http://localhost:8080/deleteUser/3

app.listen(port, ()=>{
    console.log(`app listening on port: ${port}`);
});