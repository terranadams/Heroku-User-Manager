// API to the database
const Pool = require('pg').Pool
const url = require('url')
const DBConnectionString = process.env.DATABASE_URL // this gets provided from heroku or .env

const params = url.parse(DBConnectionString)

// This logic is on my config object
const auth = params.auth.split(':')
let SSL = process.env.SSL // This reaches into .env for the SSL value, but by default it's always true.
if (SSL === 'false') {
    SSL = false
} else if (SSL = 'heroku') {
   SSL = {rejectUnauthorized: false}
} else {
    SSL = true
}
// Swap SSL to either be false: for local database, true: for me to run app on heroku and connect to heroku DB
// Third value is {rejectUnauthorized: false} which is like a bypass for when I'm running the app on my laptop
// and connect to DB in heroku
const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: SSL
}

const pool = new Pool(config);

const getUsers = (req, res)=>{
    let getUsersSQL = 'select * from users ';
    pool.query(getUsersSQL, (err, results)=>{
        if (err) throw err
        // console.log(results.rows);
        // res.status(200).json(results.rows);
        res.render('index', {users: results.rows})
    });
}
const getUserById = (req, res)=>{
    let id = req.params.id;
    console.log(`getUserById id=${id}`);
    let getUserSQL = 'select * from users where id = $1';
    pool.query(getUserSQL,[id], (err, results)=>{
        if (err) throw err
        //console.log(results);
        // res.status(200).json(results.rows);
    });
}

const createUser = (req, res)=>{
    const email = req.body.email;
    const name = req.body.name;
    let updateUserSQL = 'insert into users (email, name) values ($1, $2) RETURNING id';
    pool.query(updateUserSQL,[email, name], (err, results)=>{
        if (err) throw err
        let newId = results.rows[0].id;
        //console.log(`new id =${newId}`);
        // res.status(200).json(newId);
    });
}
const updateUser = (req, res)=>{
    const id = req.body.id;
    const name = req.body.name;
    let updateUserSQL = 'update users set name = $1 where id = $2';
    pool.query(updateUserSQL,[name, id], (err, results)=>{
        if (err) throw err
        //console.log(results);
        // res.status(200).json(results);
    });
}

const deleteUser = (req, res)=>{
    const userid = req.params.id;
    console.log(userid)
    let deleteUserSQL = 'delete from users where userid = $1 ';
    pool.query(deleteUserSQL,[userid], (err, results)=>{
        if (err) throw err
        //console.log(results);
        // res.status(200).json(results);
        res.redirect('/')
    });
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser    
}