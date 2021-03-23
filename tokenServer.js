//npm install agora-access-token required

const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const APP_ID = "2ad71ba8f058413580c895640cdf0dcb";
const APP_CERTIFICATE = "cbb222cfeca84c4ba0b1cf3304fe47b7";
const PORT = 8080;

const app = express();

const nocache = (req, resp, next) => {
  resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  resp.header('Expires', '-1');
  resp.header('Pragma', 'no-cache');
  next();
};

const generateAccessToken = function (req, resp) {
    resp.header('Access-Control-Allow-Origin', '*');

    const channelName = req.query.channelName;if (!channelName) {
      return resp.status(500).json({ 'error': 'channel is required' });
    }

    // get uid
    // use authenticated uid
    let uid = req.query.uid;
    if(!uid || uid == '') {
      uid = 0;
    }
    // get role
    let role = RtcRole.SUBSCRIBER;
    if (req.query.role == 'publisher') {
      role = RtcRole.PUBLISHER;
    }
    // get the expire time
    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime == '') {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

    return resp.json({ 'token': token , 'APP_ID': APP_ID});
};

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

