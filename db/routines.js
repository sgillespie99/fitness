

const client = require("./client");
const { createUser, getAllUsers, getUser, getUserByUsername } = require('./users');
const { getActivityById } = require('./activities');
// joining routines with their activities??


async function  getActivitiesByRoutineId (id) {
    
    try {
        const { rows: activities } = await client.query(`
        SELECT *
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" = ${id}
        `)

        return  activities
    } catch (error) {
        
    }

}


// getPublicRoutinesByActivity
//     getPublicRoutinesByActivity({ activityId })
//     select and return an array of public routines which have a specific activityId in their routine_activities join, 
//     include their activities

async function getPublicRoutinesByActivity( activityId ){


    try {
        const { rows: routines } = await client.query(`
        SELECT * 
        FROM routines
        JOIN routine_activities ON routine_activities."routineId" = routines.id
        WHERE routine_activities."activityId" = ${activityId}`)


        
        return routines

    } catch (error) {
        throw error
    }
}


async function getAllRoutines(){
    try {
        const { rows } = await client.query(`
        SELECT id, name, goal
        FROM routines;
        `);

        return rows;
    } catch (error){
        throw error
    }
}

async function getRoutineById(id){
    try{
        const { rows: [ routines ]} = await client.query(`
        SELECT * 
        FROM routines
        WHERE id = $1`,
        [id])
        
        return routines 
    } catch (error){
        throw error
    }
}


// getPublicRoutines
//     select and return an array of public routines, include their activities

async function getPublicRoutines (){
    
        try {
            const { rows: routines } = await client.query(`
            SELECT * 
            FROM routines
            WHERE public = true
            `)
            
            for (let routine of routines){
                routine.activities = await getActivitiesByRoutineId(routine.id)
            }
            
            return routines
        

    } catch (error){
        throw error
    }
}


// getAllRoutinesByUser
//     getAllRoutinesByUser({ username })
//     select and return an array of all routines made by user, include their activities

async function getAllRoutinesByUser(username) {

    const user = await getUserByUsername(username)
    
    try {
    const { rows: routines} = await client.query(`
    SELECT * 
    FROM routines
    WHERE "creatorId" = ${user.id}
    `) 
     
    for (let routine of routines){
        
        routine.activities = await getActivitiesByRoutineId(routine.id)
    }
    
    return routines
} catch (error){
    throw error
}
}


// getPublicRoutinesByUser
//     getPublicRoutinesByUser({ username })
//     select and return an array of public routines made by user, include their activities

async function getPublicRoutinesByUser(username){

    const user = await getUserByUsername(username)
    
    try {
    const { rows: routines} = await client.query(`
    SELECT * 
    FROM routines
    WHERE public = true
    WHERE "creatorId" = ${user.id}
    `)
    
    for (let routine of routines){
        routines.activities = await getActivitiesByRoutineId(routine.id)
    }
    
    return routines
} catch (error){
    throw error
}
}






// createRoutine
//     createRoutine({ creatorId, public, name, goal })
//     create and return the new routine

async function createRoutine({creatorId, public, name, goal, routine_activities = []}){
    try{
        const { rows: [ routine ] } = await client.query(`
        INSERT INTO routines("creatorId", public, name, goal)
        VALUES($1, $2, $3, $4)
        RETURNING *;
        `, [creatorId, public, name, goal])

        return routine
    } catch (error) {
        throw error;
    }
}

// updateRoutine
//     updateRoutine({ id, public, name, goal })
//     Find the routine with id equal to the passed in id
//     Don't update the routine id, but do update the public status, name, or goal, as necessary
//     Return the updated routine

async function updateRoutine(id, fields = {}){
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
      try {
          const { rows } = await client.query(`
          UPDATE routines
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
          `, Object.values(fields))
          return rows
      } catch (error){
          throw error
      }
}


// destroyRoutine
//     destroyRoutine(id)
//     remove routine from database
//     Make sure to delete all the routine_activities whose routine is the one being deleted.

async function destroyRoutine(id){
    try {
        const { rows: deleted } = await client.query(`
        DELETE FROM routines
        WHERE id = $1
        RETURNING *;
        `, [ id ])

        return deleted
        
    } catch (error){
        throw error;
    }
}


module.exports = {
    getAllRoutines,
    getPublicRoutines,
    getAllRoutinesByUser,
    createRoutine,
    getActivitiesByRoutineId,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine,
    getRoutineById

}