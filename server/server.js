const express = require('express');
//const pkg = require('../package.json');

const app = express();

app.listen(8080, function () {
    console.log('API Server listening on port 8080');
});
