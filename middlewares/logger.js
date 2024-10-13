/* export const logger = (request, response, next) => {
    console.log(
      new Date().toUTCString(), 
      'Request from', 
      request.ip, 
      request.method,
      request.originalUrl,
      response.statusCode
    ) */

export const logger = (request, response, next) => {
    response.on('finish', () => {
        console.log(
          new Date().toUTCString(), 
          'Request from', 
          request.ip, 
          request.method,
          request.originalUrl,
          'Status:', 
          response.statusCode
        );
      });
    next()
  }