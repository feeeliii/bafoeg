export const logger = (request, response, next) => {
    console.log('Logger middleware called');
    console.log(
      new Date().toUTCString(), 
      'Request from', 
      request.ip, 
      request.method,
      request.originalUrl
    )
    next()
  }