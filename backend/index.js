const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectToDatabase = require('./config/db');
const userRouter = require('./routes/userRouter');
const tripRouter = require('./routes/tripRouter');
const auth = require('./middleware/auth');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

connectToDatabase().catch(console.dir);

app.use('/user', userRouter);
app.use('/trip', auth, tripRouter);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
