
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
    destroyRoutine,
    getRoutineById,
    createRoutineActivity

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
routinesRouter.patch('/:routineId', requireUser, async ( req, res, next) => {
    const { routineId } = req.params;
    const { public, name, goal } = req.body;

    console.log(routineId)

    const updatedFields = {}

    if (public){
        updatedFields.public = public
    }

    if (name){
        updatedFields.name = name
    }

    if (goal){
        updatedFields.goal = goal
    }

    console.log(updatedFields)

    try {
        const originalRoutine = await getRoutineById(routineId)
        if (originalRoutine.creatorId === req.user.id){
        const updatedRoutine = await updateRoutine(routineId, updatedFields)
        res.send(updatedRoutine)
        } else {
            console.log(req.user.id)
            console.log(originalRoutine.creatorId)
            next({
                name: 'Unauthorized User',
                message: 'You must be the creator to update a routine'
            })
        }

    } catch ({name, message}){
        next({name, message})
    }

})


// DELETE /routines/:routineId (**)

// Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.

routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;

    try {
        const originalRoutine = await getRoutineById(routineId)
        if (originalRoutine.creatorId === req.user.id){
            const deletedRoutine = await destroyRoutine(routineId)
            res.send(deletedRoutine)
        } else{
            next({
                name: 'Unauthorized User',
                message: 'You must be the creator to delete a routine'
            })
        }
    } catch ({name, message}){
        next({name, message})
    }
})

// POST /routines/:routineId/activities

// Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.

routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body

    const postData = {}
    try {
        postData.routineId = routineId;
        postData.activityId = activityId;
        postData.count = count;
        postData.duration = duration;
        console.log(postData, "post data info here")
        const  post = await createRoutineActivity(postData)
        console.log(post, "Post ")
        if (!post) {
            next({ name: 'PostCreationError',
            message: 'There was an error creating your routine activity. Please try again.'
        })
        } else {
            res.send(post)
        }
        
    } catch ({name, message}) {
        next({name, message})
    }
})

module.exports = routinesRouter