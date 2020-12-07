const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
const requestHandler = function(request, response) {
  
  const route = `${request.url}`;
  
  switch (route) {
    case '/':
      response.end('welcome');
      break;
    case '/urls':
      response.end('http://www.google.com');
      break;
    default:
      response.statusCode = 404;
      response.end('404 page not found');
  };

};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});