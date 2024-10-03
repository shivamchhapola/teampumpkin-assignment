const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    gpsData: [
      {
        latitude: Number,
        longitude: Number,
        timestamp: Date,
        ignition: Boolean,
      },
    ],
    distance: Number,
    duration: Number,
    stoppages: [{ latitude: Number, longitude: Number, duration: Number }],
    idles: [{ latitude: Number, longitude: Number, duration: Number }],
    stopduration: Number,
    idleduration: Number,
    overspeedduration: Number,
    overspeeddistance: Number,
    overspeeds: [[[Number]]],
    tripIndex: Number,
    tripRoute: [[Number, Number]],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
