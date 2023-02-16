const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors')

const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/tops1second';
const IEX_CLOUD_API_KEY = 'sk_4b6ebe9d84b44fe48cbf602d2c70884e'; // Replace with your actual API key

app.use(cors())

app.get('/stream', (req, res) => {
  req.pipe(request({
    // url: 'https://cloud-sse.iexapis.com/stable/tops1second?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e&symbols=ndaq,vxx',
    url: IEX_CLOUD_API_ENDPOINT,
    headers: {
      'Accept': 'text/event-stream'
    },
    qs: {
      token: IEX_CLOUD_API_KEY,
      symbols: 'ndaq,vxx,pcg'
    }
  })
  ).pipe(res);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});