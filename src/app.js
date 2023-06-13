const express = require('express');

const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');

const { errorHandler } = require('./middlewares/error-handler');
const { serviceRouter } = require('./services');
const { setCronJobsAndRun } = require('./resources/cron');

const PORT = 3000;

class App {
  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.connectMongoDB();
    this.initRouter();
    this.initErrorHandlers();
    this.openServer();
    this.initializeCronJobs();
  }

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  initErrorHandlers() {
    this.app.use(errorHandler);
  }

  initRouter() {
    this.app.use('/', serviceRouter);
    /*fs.readdirSync('./src/services').forEach((service) => {
      this.app.use('/' + service , require(`./services/${service}`));
    });*/
  }

  openServer() {
    this.app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
  }

  connectMongoDB() {
    const { mongoUri } = config;
    const mongooseOption = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoUri, mongooseOption, (err) => {
      if (err) {
        console.log('MongoDB connection error: ', err);
      } else {
        console.log('MongoDB connected successfully');
      }
    });
  }

  initializeCronJobs() {
    setCronJobsAndRun();
  }
}

module.exports = new App().app;