const express = require('express');
//const pkg = require('../package.json');

const app = express();

app.listen(3000, function () {
    console.log('API Server listening on port 3000');  //eslint-disable-line
});
