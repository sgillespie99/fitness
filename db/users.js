
//     createUser
//     createUser({ username, password })
//     make sure to hash the password before storing it to the database
// getUser
//     getUser({ username, password })
//     this should be able to verify the password against the hashed password

const client = require("./client");
const bcrypt = require('bcrypt')

// how to hash password????
// do JWT instead of hash

async function createUser({username, password}){

    try {
        const { rows: [ user ]} = await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]
        )
        return user
    } catch (error){
        throw error
    }

}

// how get user??
// async function getUser({username, password}){

//     if (!username || !password){
//         return
//     } 

//     try {
//    const user = (await user)
//    const isMatch = bcrypt.compareSync (password, user.password)
//    if (!isMatch){
//        throw error
//    }

//     if (!user) {
//         throw {
//             name: "Error User not found",
//             message: "This user does not exsist"
//         }
//     }
//     return user;

// } catch (error){
//     throw error
// }
// }


async function getUser({username, password}){
    try{
        const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1`, [ username ])

        return user
    } catch (error){
        throw error
    }
}


// make get user by username/id for now until json web stuff 

async function getUserByUsername(username){
    try {
        const { rows: [ user ] } = await client.query(`
        SELECT * 
        FROM users
        WHERE username=$1
        `, [ username ]);

        if (!user){
            throw{ 
                name: "UserNotFound",
                message: "This user does not exist"
            }
        }

        return user;
    } catch (error){
        throw error;
    }
}



async function getAllUsers(){
    try {
        const { rows } = await client.query(`
        SELECT id, username
        FROM users;`
        );
        return rows;
    } catch (error){
        throw error;
    }
}


async function getUserById(userId) {
    try {
      const { rows: [ user ] } = await client.query(`
        SELECT id, username
        FROM users
        WHERE id=${ userId }
      `);
  
      if (!user) {
        return null
      }
  
  
      return user;
    } catch (error) {
      throw error;
    }
  }



module.exports = {
    createUser,
    getAllUsers,
    getUser,
    getUserByUsername,
    getUserById
}