
//     getAllActivities
//     select and return an array of all activities
// createActivity
//     createActivity({ name, description })
//     return the new activity
// updateActivity
//     updateActivity({ id, name, description })
//     don't try to update the id
//     do update the name and description
//     return the updated activity

const client = require("./client");


async function getAllActivities(){
    try {
        const { rows } = await client.query(`
        SELECT id, name, description
        FROM activities;
        `);

        return rows;
    } catch (error){
        throw error
    }
}


async function getActivityById(id){
    try {
        const {rows: [ activity ] } = await client.query(`
        SELECT *
        FROM activities
        WHERE id = $1 
        `, [ id ])
        return activity
    } catch (error){
        throw error;
    }
}



async function createActivity ({name, description}){
    try {
        const { rows: [activities] } = await client.query(`
        INSERT INTO activities(name, description)
        VALUES($1, $2)
        RETURNING *;
        `, [name, description]);

        return activities

    } catch (error){
        throw (error)
    }
}

// am I making a setstring like before ?


async function updateActivity(id, fields = {}){
 const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
    console.log(setString.length, fields)
 try {
     
        const { rows } = await client.query(`
         UPDATE activities
         SET ${ setString }
         WHERE id=${ id }
         RETURNING *;`, Object.values(fields))
        console.log(rows, "this is rows")
         return rows
     
 } catch (error){
     throw error;
 }
}




module.exports = {
    getAllActivities,
    createActivity,
    updateActivity,
    getActivityById
}