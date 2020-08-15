
const express = require('express');
const apiRouter = express.Router();





const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;

// should set user?
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) { // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });



const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter)

const routinesRouter = require('./routines')
apiRouter.use('/routines', routinesRouter)

const routine_activitiesRouter = require('./routine_activities');
apiRouter.use('/routine_activities', routine_activitiesRouter)


apiRouter.use((error, req, res, next) => {
res.send(error);
});


module.exports = apiRouter;

