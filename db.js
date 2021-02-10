// API to the database
const Pool = require('pg').Pool
const url = require('url')
const DBConnectionString = process.env.DATABASE_URL // this gets provided from heroku or .env

const params = url.parse(DBConnectionString)

const auth = params.auth.split(':')
let SSL = process.env.SSL
if (SSL === 'false') {
    SSL = false
} else if (SSL = 'heroku') {
   SSL = {rejectUnauthorized: false}
} else {
    SSL = true
}

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: SSL
}

const pool = new Pool(config)

const getUsers = (req, res) => { // This gets put into the callback for the initial get request
    let getUsersSQL = 'select * from users '
    pool.query(getUsersSQL, (err, results) => {
        if(err) throw err
        // console.log(results)
        res.status(200).json(results.rows)
    })
}

const createUser = (req, res) => {
    // console.log(`db getUsers`);
    const email = req.body.email
    let getUsersSQL = `insert into users (first, last, email, age) values ($1, $2, $3, $4);`
    pool.query(getUsersSQL, [first, last, email, age], (err, results) => {
        if (err) throw err
    //   console.log(results)
      res.status(200).json(results.rows);
    });
  };

module.exports = {
    getUsers,
    createUser
}

