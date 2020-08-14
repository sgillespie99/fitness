
// users
// POST /users/register

// Create a new user. Require username and password, 
// and hash password before saving user to DB. Require all passwords to be at least 8 characters long.

// Throw errors for duplicate username, or password-too-short.
// POST /users/login

// Log in the user. Require username and password, 
// and verify that plaintext login password matches the saved hashed password before returning a JSON Web Token.

// Keep the id and username in the token.
// GET /users/:username/routines

// Get a list of public routines for a particular user.


const express = require('express');

const usersRouter = express.Router();

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const SALT_COUNT = 10

const { createUser,
    getAllUsers,
    getUser,
    getUserByUsername, getPublicRoutinesByUser, getAllRoutinesByUser} = require('../db');

usersRouter.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.send({
            users
        })
    } catch ({name, message}){
        next({name,message})
    }
})




// usersRouter.use((req, res, next) => {
//     console.log("A request is being made to /users")
//     res.send({ message: 'Hi from /users'})
// })

// usersRouter.get()




usersRouter.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        let securedPassword;
        const SALT_COUNT = 10
        console.log(username, password)
        const _user = await getUser(  username );

        if (_user) {
            next({
                message: 'this user already exists'
            })
        } else if (password.length < 8){
            console.log('Please enter a password greater than eight')
            return
        } else {

        bcrypt.hash(password, SALT_COUNT, async (err, hashedPassword) => {
            console.log(hashedPassword);
            securedPassword = hashedPassword;
            const newUser = await createUser({ username, 
                password: securedPassword });

            const token = jwt.sign({
                id: newUser.id,
                username
            }, process.env.JWT_SECRET, {
                expiresIn: '1w'
            })

            res.send({ message: 'user created', token: token})
        })
    }
        } catch ({name, message}){
            next({name, message})
        }
    })

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    
    console.log(username, password)

    if (!username || !password) {
        next({
          name: "MissingCredentialsError",
          message: "Please supply both a username and password"
        });
      }
      try {
        const user = await getUserByUsername(username);
        const hashedPassword = user.password;
    bcrypt.compare(password, hashedPassword, function(err, passwordsMatch) {
    if (passwordsMatch) {
        const token = jwt.sign({ 
            id: user.id, 
            username
          }, process.env.JWT_SECRET, {
            expiresIn: '1w'
          });
    
          res.send({ 
            message: "you're logged in!",
            token: token 
          });
  } else {
    next({
        name: 'incorrect Credentials',
        message: 'username or password is incorrect'
    })
  }
}) 
} catch (error){
    console.log(error)
    next(error)
};
} )


// GET /users/:username/routines

// Get a list of public routines for a particular user.

usersRouter.get('/:username/routines', async (req, res, next) => {
const  { username }  = req.params;
console.log(username)
    try {
        const userRoutines = await getAllRoutinesByUser(username)
        if (userRoutines.public = true){

        res.send( userRoutines ) }
    } catch ({name, message}){
        next({ name, message})
    }
})



module.exports =  usersRouter 