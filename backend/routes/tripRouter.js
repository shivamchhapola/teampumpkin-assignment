const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

router.post('/createTrip', tripController.createTrip);
router.post('/getTripByUserIndex', tripController.getTripByUserIndex);
router.post('/deleteTrip', tripController.deleteTrip);

router.get('/getAllTrips', tripController.getAllTrips);

module.exports = router;
