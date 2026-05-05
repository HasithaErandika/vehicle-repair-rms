'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  let retries = 5;
  let delay = 3000;
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 20,             // increased for DO production traffic
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`MongoDB connected: ${mongoose.connection.host}`);
      return;
    } catch (err) {
      retries--;
      logger.error(`MongoDB connection failed. Retries left: ${retries}. Error: ${err.message}`);
      if (!retries) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 2, 30_000); // exponential backoff, cap at 30 s
    }
  }
};

module.exports = connectDB;
