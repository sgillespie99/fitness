const client = require("./client")

async function dropTables(){
    try {
        console.log("Dropping tables")

    } catch (error){
        console.error("Error dropping tables")
        throw error
    }

}

async function createTables(){
    try {
        console.log("Creating tables")

        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL
            password varchar(255) NOT NULL
        );`)

        console.log("finished building tables")
    } catch (error){
        console.error("Error building table!!!!")
        throw error
    }
}

