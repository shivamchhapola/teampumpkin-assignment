const { getDistance } = require('geolib');
const TripModel = require('../models/TripModel');
const UserModel = require('../models/UserModel');
const { differenceInSeconds } = require('date-fns');

exports.createTrip = async (req, res) => {
  try {
    const { gpsData, name } = req.body;

    const user = await UserModel.findById(req.user.id);

    const trip = new TripModel({
      user: req.user.id,
      name,
      tripIndex: user.tripIndexCount + 1,
      gpsData,
    });
    await trip.save();

    user.tripIndexCount += 1;
    await user.save();

    let distance = 0;
    let duration = 0;
    let stoppages = [];
    let idles = [];
    let stopduration = 0;
    let idleduration = 0;
    let overspeedduration = 0;
    let overspeeddistance = 0;
    let overspeeds = [];
    let currentStoppage = null;
    let currentIdling = null;
    let currentOverspeed = [];
    let tripRoute = gpsData.map((row) => [row?.latitude, row?.longitude]);

    function endStoppage(start, end) {
      const duration = differenceInSeconds(end.timestamp, start.timestamp);
      if (duration > 0) {
        stoppages.push({
          latitude: start.latitude,
          longitude: start.longitude,
          duration,
        });
      }
      stopduration += duration;
      currentStoppage = null;
    }

    function endIdling(start, end) {
      const duration = differenceInSeconds(end.timestamp, start.timestamp);
      if (duration > 0) {
        idles.push({
          latitude: start.latitude,
          longitude: start.longitude,
          duration,
        });
      }
      idleduration += duration;
      currentIdling = null;
    }

    for (let i = 1; i < gpsData.length; i++) {
      const prevPoint = gpsData[i - 1];
      const currentPoint = gpsData[i];

      const dis = getDistance(
        { latitude: prevPoint.latitude, longitude: prevPoint.longitude },
        { latitude: currentPoint.latitude, longitude: currentPoint.longitude }
      );

      const timeBetweenPoints = differenceInSeconds(
        currentPoint.timestamp,
        prevPoint.timestamp
      );

      //total distance/duration calculation
      distance += dis;
      duration += timeBetweenPoints;

      //overspeed calculation
      if (timeBetweenPoints > 0) {
        const speed = (dis / timeBetweenPoints) * 3.6;
        if (speed > 60) {
          currentOverspeed.push([prevPoint.latitude, prevPoint.longitude]);
          overspeeddistance += dis;
          overspeedduration += timeBetweenPoints;
        } else if (currentOverspeed.length > 0) {
          currentOverspeed.push([prevPoint.latitude, prevPoint.longitude]);
          overspeeds.push(currentOverspeed);
          currentOverspeed = [];
        }
      }

      //stoppage and idle calculation
      if (dis === 0) {
        //stoppage
        if (!currentPoint.ignition) {
          if (currentIdling) {
            endIdling(currentIdling, prevPoint);
          }
          if (!currentStoppage) {
            currentStoppage = prevPoint;
          }
        } //idle
        else {
          if (currentStoppage) {
            endStoppage(currentStoppage, prevPoint);
          }
          if (!currentIdling) {
            currentIdling = prevPoint;
          }
        }
      } else {
        if (currentStoppage) {
          endStoppage(currentStoppage, prevPoint);
        }
        if (currentIdling) {
          endIdling(currentIdling, prevPoint);
        }
      }
    }

    trip.duration = duration;
    trip.distance = distance;
    trip.stoppages = stoppages;
    trip.idles = idles;
    trip.idleduration = idleduration;
    trip.stopduration = stopduration;
    trip.overspeeddistance = overspeeddistance;
    trip.overspeedduration = overspeedduration;
    trip.overspeeds = overspeeds;
    trip.tripRoute = tripRoute;

    await trip.save();

    return res.json({ message: 'Successfully created trip', trip });
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Error creating trip', error });
  }
};

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await TripModel.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.json(trips);
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Error getting all trips', error });
  }
};

exports.getTripByUserIndex = async (req, res) => {
  try {
    const trip = await TripModel.findOne({
      user: req.user.id,
      tripIndex: req.body.tripIndex,
    });

    return res.json(trip);
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Error getting trip by user index', error });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await TripModel.findByIdAndDelete(req.body.tripid);
    return res.json(trip);
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Error deleting trip', error });
  }
};
