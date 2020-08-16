


const client = require("./client");


// check if this guy makes sense?

async function createRoutineActivity ({routineId, activityId, count, duration}){
    try {
      const { rows: routineActivity } =  await client.query(`
        INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("routineId", "activityId") DO NOTHING
        RETURNING *;
        `, [ routineId, activityId, count, duration])

        return routineActivity
    } catch (error){
        throw error
    }
}


async function updateRoutineActivity (id, fields = {}){
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
   
    try {
        
           const { rows } = await client.query(`
            UPDATE routine_activities
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;`, 
            Object.values(fields))
            
            return rows;
        
    } catch (error){
        throw error;
    }
}


async function destroyRoutineActivity(id){
    try{
        const { rows: deleted } = await client.query(`
        DELETE FROM routine_activities
        WHERE "id" = $1
        RETURNING *;`,
        [id])

        return deleted
    } catch (error){
        throw error;
    }
}

async function getRoutineActivityById(id){
    try{
        const {rows: [routine_activities]} = await client.query(`
        SELECT *
        FROM routine_activities
        WHERE id = $1
        `, [id])

        return routine_activities
    } catch(error){
        throw error
    }
}


module.exports = {
    createRoutineActivity,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivityById
}