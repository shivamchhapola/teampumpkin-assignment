const mongoose = require('mongoose');

const clientOptions = {
  serverApi: { version: '1', strict: false, deprecationErrors: true },
};

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.log(err);
  }
}

module.exports = dbConnect;
