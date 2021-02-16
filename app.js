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
app.get('/', db.getUsers); 
app.get('/create', db.getForm)
app.post('/create', db.createUser);
app.get('/edit/:userid', db.getUserEditPage);
app.post('/edit/:userid', db.updateUser);
app.post('/deleteUser/:id', db.deleteUser);
app.get('/user/:id', db.getUserById);

app.listen(port, ()=>{
    console.log(`app listening on port: ${port}`);
});