
const express = require('express')

const routinesRouter = express.Router()

const {
    getAllRoutines,
    getPublicRoutines,
    getAllRoutinesByUser,
    createRoutine,
    getActivitiesByRoutineId,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine

} = require('../db')

const { requireUser } = require('./utils')
const routines = require('../db/routines')

// routines
// GET /routines

// Return a list of public routines, include the activities with them

routinesRouter.get('/', async (req, res, next) =>{
try{
    const allPublicRoutines = await getPublicRoutines();
    res.send(allPublicRoutines)
} catch ({name, message}){
    next({name, message})
}
})


// POST /routines (*)

// Create a new routine

routinesRouter.post('/', requireUser, async (req, res, next) =>{
    const { public, name, goal } = req.body

    const postData = {}

    try {
        postData.creatorId = req.user.id;
        postData.public = public;
        postData.name = name;
        postData.goal = goal

        const post = await createRoutine(postData)
        if (post) {
            res.send(post);
          } else {
            next({
              name: 'PostCreationError',
              message: 'There was an error creating your post. Please try again.'
            })
          }
    } catch ({name, message}) {
        next({ name, message });
    }
})


// PATCH /routines/:routineId (**)

// Update a routine, notably change public/private, the name, or the goal



// DELETE /routines/:routineId (**)

// Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.


// POST /routines/:routineId/activities

// Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.


module.exports = routinesRouter