const express = require('express')

const activitiesRouter = express.Router();



// activities

// POST /activities (*)
// Create a new activity


// PATCH /activities/:activityId (*)

// Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)










const {     getAllActivities,
    createActivity,
    updateActivity,
    getActivityById, getActivitiesByRoutineId, getPublicRoutinesByActivity } = require('../db');

    
    



    
    
activitiesRouter.get('/', async (req, res, next) => {
        try {
            const allActivities = await getAllActivities();
            res.send({allActivities})
        } catch ({name, message}){
            next({name, message})
        }
    })


// activitiesRouter.post('/')




    activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
        const { activityId } = req.params
        console.log(activityId)
        try {
            const activityById = await getPublicRoutinesByActivity( activityId )
            if (activityId.public = true){ res.send( activityById ) }
                
            
        }catch ({name, message}){
            next({name, message})}
    })

    module.exports = activitiesRouter