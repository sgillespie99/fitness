
  const express = require('express')

  const routine_activitiesRouter = express.Router()
  
  const {  createRoutineActivity,
    updateRoutineActivity,
    destroyRoutineActivity } = require('../db')

    const { requireUser } = require('./utils')

// routine_activities
// PATCH /routine_activities/:routineActivityId (**)

// Update the count or duration on the routine activity

routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActvityId } = req.params;
    const { duration, count } = req.body;
    
    const updatedFields = {}

    if (duration){
        updatedFields.duration = duration
    }

    if (count){
        updatedFields.count = count
    }

    try {
        const updatedRoutine_activity = await updateRoutineActivity(routineActvityId, updatedFields)
        res.send(updatedRoutine_activity)
    } catch ({name, message}) {
        next({name, message})
        
    }

})



// DELETE /routine_activities/:routineActivityId (**)

// Remove an activity from a routine, use hard delete

routine_activitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActvityId } = req.params;

    try {
        const deletedRoutineActivity = await destroyRoutineActivity(routineActvityId)
        res.send(deletedRoutineActivity)
    } catch ({name, message}) {
        next({name, message})
        
    }
})


module.exports = routine_activitiesRouter