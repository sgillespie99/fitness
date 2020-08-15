


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
        if (setString.length > 0){
           const { rows } = await client.query(`
            UPDATE routine_activities
            SET ${ setString }
            WHERE "routineId"=${ id }
            RETURNING *;`, Object.values(fields))
            
            return rows;
        }
    } catch (error){
        throw error;
    }
}


async function destroyRoutineActivity(activityId){
    try{
        const { rows: deleted } = await client.query(`
        DELETE FROM routine_activities
        WHERE "activityId" = $1
        RETURNING *;`,
        [activityId])

        return deleted
    } catch (error){
        throw error;
    }
}


module.exports = {
    createRoutineActivity,
    updateRoutineActivity,
    destroyRoutineActivity
}