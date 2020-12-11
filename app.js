'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const kuvaRoute = require('./routes/kuvaRoute');
const userRoute = require('./routes/userRoute');
const passport = require('./utils/pass.js');
const authRoute = require('./routes/authRoute.js');
const commentRoute = require('./routes/commentRoute');
const likeRoute = require('./routes/likeRoute');
const kuntaRoute = require('./routes/kuntaRoute');
const fs      = require('fs');
const https   = require('https');



const app = express();
const port = 3000;

const sslkey  = fs.readFileSync('/etc/pki/tls/private/ca.key');
const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
const options = {
    key: sslkey,
    cert: sslcert
};


app.use(cors());
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/kuva', passport.authenticate('jwt', {session: false}), kuvaRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/comment', passport.authenticate('jwt', {session: false}), commentRoute);
app.use('/like', passport.authenticate('jwt', {session: false}), likeRoute);
app.use('/kunta', passport.authenticate('jwt', {session: false}), kuntaRoute);



https.createServer(options, app).listen(8000);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

