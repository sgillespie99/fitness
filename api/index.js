



const express = require('express');
const apiRouter = express.Router();



const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter)

const routinesRouter = require('./routines')
apiRouter.use('/routines', routinesRouter)


apiRouter.use((error, req, res, next) => {
res.send(error);
});


module.exports = apiRouter;
