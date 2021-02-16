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
    SSL = { rejectUnauthorized: false }
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
const getUsers = (req, res) => {
    let getUsersSQL = 'select * from users ';
    pool.query(getUsersSQL, (err, results) => {
        if (err) throw err
        // console.log(results.rows);
        // res.status(200).json(results.rows);
        let ordered = results.rows.sort((a, b) => (a.userid > b.userid) ? 1 : -1)
        res.render('index', { users: ordered })
    });
}

const getUserEditPage = (req, res) => {
    let userid = req.params.userid
    let getUserSQL = 'select * from users where userid = $1';
    pool.query(getUserSQL, [userid], (err, results) => {
        if (err) throw err
        // console.log(results.rows[0]);
        res.render('editForm', { user: results.rows[0] })
    });
}
const searchUser = (req, res) => {
    let search = req.body.search
    // console.log(search)



    // let filteredList = data.filter(x => {
    //     let first = x.first.toLowerCase()
    //     let last = x.last.toLowerCase()
    //     return first == search || last == search
    // })
    pool.query('select * from users', (err, results) => {
        if (err) throw err
        let filteredList = results.rows.filter(x => {
            let first = x.first.toLowerCase()
            let last = x.last.toLowerCase()
            return first == search || last == search
        })
        res.render('index', { users: filteredList })
    })
    // let id = req.params.id;
    // console.log(`getUserById id=${id}`);
    // let getUserSQL = 'select * from users where id = $1';
    // pool.query(getUserSQL, [id], (err, results) => {
    //     if (err) throw err
    //     //console.log(results);
    //     // res.status(200).json(results.rows);
    // });
}

const getForm = (req, res) => {
    res.render('form')
}

const createUser = (req, res) => {
    let userid
    const first = req.body.first
    const last = req.body.last
    const email = req.body.email
    const age = req.body.age

    pool.query('select MAX(userid) from users', (err, results) => {
        userid = results.rows[0].max + 1
        let updateUserSQL = 'insert into users (userid, first, last, email, age) values ($1, $2, $3, $4, $5)';
        pool.query(updateUserSQL, [userid, first, last, email, age], (err, results) => {
            if (err) throw err
            res.redirect('/')
        });
    })


}
const updateUser = (req, res) => {
    const userid = req.params.userid
    const first = req.body.first
    const last = req.body.last
    const email = req.body.email
    const age = req.body.age

    let updateUserSQL = 'update users set first = $1, last = $2, email = $3, age = $4 where userid = $5';
    pool.query(updateUserSQL, [first, last, email, age, userid], (err, results) => {
        if (err) throw err
        //console.log(results);
        // res.status(200).json(results);
        res.redirect('/')
    });
}

const deleteUser = (req, res) => {
    const userid = req.params.id;
    // console.log(userid)
    let deleteUserSQL = 'delete from users where userid = $1 ';
    pool.query(deleteUserSQL, [userid], (err, results) => {
        if (err) throw err
        //console.log(results);
        // res.status(200).json(results);
        res.redirect('/')
    });
}

module.exports = {
    getUsers,
    searchUser,
    createUser,
    updateUser,
    deleteUser,
    getUserEditPage,
    getForm
}