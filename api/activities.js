const express = require('express')

const activitiesRouter = express.Router();


const {     getAllActivities,
    createActivity,
    updateActivity,
    getActivityById, getActivitiesByRoutineId, getPublicRoutinesByActivity } = require('../db');
const { requireUser } = require('./utils');

    
    
// Routers:
  
activitiesRouter.get('/', async (req, res, next) => {
        try {
            const allActivities = await getAllActivities();
            res.send({allActivities})
        } catch ({name, message}){
            next({name, message})
        }
    })


// activitiesRouter.post('/')

activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const {name, description } = req.body

    const postData = {}

    try {
        postData.name = name;
        postData.description = description

        const post = await createActivity(postData)

        if (post){
            res.send(post);
        } else {
            next({
                name: 'activity creation error',
                message: 'there was an error creating your activity'
            })
        }
    } catch ({name, message}) {
        next({ name, message })
    }
})

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;

    const updatedFields = {}

    if (name){
        updatedFields.name = name
    }
    if (description){
        updatedFields.description = description
    }
    try {
       
        const updatedActivity = await updateActivity(activityId, updatedFields)
        res.send(updatedActivity)
    } catch ({name, message}){
        next({name, message})
    }

})


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