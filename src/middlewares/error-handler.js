const { NextFunction, Request, Response } = require('express');

const sendError = (res = Response, status, message) => {
  res.status(status).json({ message });
};

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'HttpException': {
      const { name, status = 500, message } = err;
      console.log(name, message);
      sendError(res, status, message);
      break;
    }
    case 'MongoError': {
      //const { name, status = 500, message } = err;
      sendError(res, 500, "오류가 발생하였습니다.");
      break;
    }
    default: {
      console.log(err.name, err.message);
      sendError(res, 500, '알 수 없는 에러가 발생했습니다.');
      break;
    }
  }
}

module.exports = { errorHandler };