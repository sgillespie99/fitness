const client = require('./client');
const { createUser, getAllUsers, getUser, getUserByUsername } = require('./users');
const { createActivity, getAllActivities, updateActivity } = require('./activities');
const { getAllRoutines, getPublicRoutines, getAllRoutinesByUser, createRoutine, getActivitiesByRoutineId, getPublicRoutinesByUser, updateRoutine, getPublicRoutinesByActivity, getRoutineById, destroyRoutine } = require('./routines');
const {   createRoutineActivity, updateRoutineActivity, destroyRoutineActivity } = require('./routine_activities');


async function dropTables() {
	try {
		console.log('Dropping tables');
		await client.query(`
        
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;`);

		console.log('End dropping tables');
	} catch (error) {
		console.error('Error dropping tables');
		throw error;
	}
}

async function createTables() {
	try {
		console.log('Creating tables');

		await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255)  NOT NULL
        );
        
        CREATE TABLE activities (
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
            );

            CREATE TABLE routines (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id),
                public BOOLEAN DEFAULT false,
                name VARCHAR(255) UNIQUE NOT NULL,
                goal TEXT NOT NULL
            );

            CREATE TABLE routine_activities (
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            duration INTEGER,
            count INTEGER,
            UNIQUE ("activityId", "routineId") 
            ); 
    
          
     
`);


		console.log('finished building tables');
	} catch (error) {
		console.error('Error building table!!!!');
		throw error;
	}
}

async function createInitialUsers() {
	try {
		console.log('creating users');

		await createUser({
			username: 'sebas',
			password: 'password',
		});

		await createUser({
			username: 'extra_spicey',
			password: 'alsopassword',
		});

		console.log('Users created');
	} catch (error) {
		console.error('Error creating users');
		throw error;
	}
}

async function createInitialActivites() {
	try {
		// const [sebas, extra_spicey] = await getAllUsers();

		console.log('creating initial activites');

		await createActivity({
			name: 'Running',
			description: 'Get your heart rate up with a solid run!',
		});

		await createActivity({
			name: 'Weight Lifting',
			description: 'Pump some iron and get those gains!',
		});

		await createActivity({
			name: 'Swimming',
			description: 'a good full body exercise!',
        });
        
        await createActivity({
            name: 'Biking',
            description: 'put the pedal to the metal...or dirt I guess?'
        })

		console.log('finished making activites');
	} catch (error) {
		console.log('error making activities');
		throw error;
	}
}


// you were here making initial routines *****
async function createInitialRoutines(){
  try {  console.log('creating initial routines');
    const [ sebas, extra_spicey ] = await getAllUsers ();
    await createRoutine({
        creatorId: sebas.id,
        public: true,
        name: 'leg work bayeeebeeeee',
        goal: 'get shredded legs by summer'
    })

    await createRoutine({
        creatorId: sebas.id,
        public: true,
        name: 'calf raises',
        goal: 'raise the baby cows'
    })

    await createRoutine({
        creatorId: extra_spicey.id,
        public: true,
        name: 'body workout',
        goal: 'full body workout using body weight'

    })

    await createRoutine({
        creatrorId: extra_spicey.id,
        public: false,
        name: 'out of body-workout',
        goal: 'get outside of your head with these extradimensional exercises'
    })

    await createRoutine({
        creatorId: extra_spicey.id,
        public: true,
        name:'delete me!',
        goal: 'my goal is death!'
    })

    console.log('finished making routines')
} catch (error) {
    console.log('error making routines')
    throw error
}
}

async function createInitialRoutineActivities (){
    try {
        console.log('creating initial routine activities')
        await createRoutineActivity({
            routineId: 1,
            activityId: 1,
            count: 57,
            duration: 5
        })
        await createRoutineActivity({
            routineId: 2,
            activityId: 4,
            count: 4,
            duration: 5000
        })

        await createRoutineActivity({
            routineId: 1,
            activityId: 2,
            count: 9000,
            duration: 100
        })

        await createRoutineActivity({
            routineId: 2,
            activityId: 2,
            count:  500,
            duration: 300
        })
        
    } catch (error){
        console.log('error making routine activities')
        throw error
    }
}

async function rebuildDB() {
	try {
		client.connect();

		await dropTables();
		await createTables();
		await createInitialUsers();
        await createInitialActivites();
        await createInitialRoutines();
        await createInitialRoutineActivities();
	} catch (error) {
		console.error(error);
	}
}

async function testDB() {
	try {
		console.log('testing database');

		console.log('Calling getAllUsers');
		const users = await getAllUsers();
        console.log('getAllUsers:', users);

        console.log('Calling getAllActivities')
        const activities = await getAllActivities();
        console.log('getAllActivites:', activities)

        console.log('Calling getAllRoutines')
        const allRoutines = await getAllRoutines();
        console.log('getAllRoutines:', allRoutines)

        console.log('Calling getPublicRoutines')
        const publicRoutines = await getPublicRoutines();
        console.log('getPublicRoutines:', publicRoutines)

        console.log('Calling getAllRoutinesByUser')
        const routinesbyUserId = await getAllRoutinesByUser('sebas');
        console.log('getAllRoutinesByUser:', routinesbyUserId)

        console.log("calling getActivitiesByRoutineId")
        const getActivitiesbyRoutineIdTest = await getActivitiesByRoutineId(1);
        console.log('getActivitiesByRoutineId:', getActivitiesbyRoutineIdTest )

        console.log('calling updateActivities')
        const updatedActivity = await updateActivity(1, {
            name: 'new name',
            description: 'new description'
        })
        console.log('updateActivities:', updatedActivity)

        console.log('calling updateRoutine')
        const updatedRoutine = await updateRoutine(3, {
            public: true,
            name: 'new name for routine',
            goal: 'new goal for routine'
        })
        console.log('updateRoutine:', updatedRoutine)

        console.log('calling getPublicRoutinesByActivity')
        const publicRoutinesbyActivity = await getPublicRoutinesByActivity(1)
        console.log('getPublicRoutinesByActivity:', publicRoutinesbyActivity )

        console.log('calling getRoutineById')
        const routinebyId = await getRoutineById(2);
        console.log('getRoutineById:', routinebyId)

        console.log('calling destroyRoutine');
        const deletedroutine = await destroyRoutine(5);
        console.log('destroyRoutine:')

	} catch (error) {
		console.log('error during tests');
		throw error;
	}
}

rebuildDB()
	.then(testDB)
	.catch(console.error)
	.finally(() => client.end());
