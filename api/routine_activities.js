
  const express = require('express')

  const routine_activitiesRouter = express.Router()
  
  const {  createRoutineActivity,
    updateRoutineActivity,
    destroyRoutineActivity, 
    getRoutineById,
    getRoutineActivityById} = require('../db')

    const { requireUser } = require('./utils')

// routine_activities
// PATCH /routine_activities/:routineActivityId (**)

// Update the count or duration on the routine activity

routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { duration, count } = req.body;
    
    console.log(routineActivityId)

    const updatedFields = {}

    if (duration){
        updatedFields.duration = duration
    }

    if (count){
        updatedFields.count = count
    }
    console.log(updatedFields)
    try {
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId)
        console.log(originalRoutineActivity, "Original RoutineActivity")
        const originalRoutine = await getRoutineById(originalRoutineActivity.routineId)
        console.log(originalRoutine, "originalRoutine")
        if (originalRoutine.creatorId === req.user.id){
        const updatedRoutine_activity = await updateRoutineActivity(routineActivityId, updatedFields)
        console.log(updatedRoutine_activity, 'updatedRoutine_activity')
        res.send(updatedRoutine_activity)
        }
        else {
            ({name: 'Unauthorized User',
            message: 'You must be the creator to update a routine_activity'
        })
        }
    } catch ({name, message}) {
        next({name, message})
        
    }

})



// DELETE /routine_activities/:routineActivityId (**)

// Remove an activity from a routine, use hard delete

routine_activitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId)
        const originalRoutine = await getRoutineById(originalRoutineActivity.routineId)
        if(originalRoutine.creatorId === req.user.id){
        const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
        res.send(deletedRoutineActivity)}
        else{
            ({name: 'Unauthorized User',
            message: 'You must be the creator to delete a routine_activity'
        }) 
        }
    } catch ({name, message}) {
        next({name, message})
        
    }
})


module.exports = routine_activitiesRouter