const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useCreateIndex: true,
      // useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log('DB connected successfully!');
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
  }
};

module.exports = dbConnect;
