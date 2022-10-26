const express = require('express');
const {
    getAllWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout
} = require('../controllers/workoutController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// require auth for all workout routes
router.use(requireAuth);

router.route('/')
    .get(getAllWorkouts)
    .post(createWorkout);

router.route('/:id')
    .get(getWorkout)
    .delete(deleteWorkout)
    .patch(updateWorkout);

module.exports = router;
