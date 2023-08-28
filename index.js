const http = require('http');

const requestHandler = (req, res) => {
    res.write('ok ok');
    res.end();
};

const server = http.createServer(requestHandler);

const port = process.env.HTTP_PORT || 8080;

server.listen(port, () => console.log(`Listening on port ${port}`));
