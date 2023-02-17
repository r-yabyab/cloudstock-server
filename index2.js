const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors')

const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/tops1second';
const IEX_CLOUD_API_KEY = 'sk_4b6ebe9d84b44fe48cbf602d2c70884e'; // Replace with your actual API key

app.use(cors())

// app.get('/stream', (req, res) => {
//   req.pipe(request({
//     // url: 'https://cloud-sse.iexapis.com/stable/tops1second?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e&symbols=ndaq,vxx',
//     // url: IEX_CLOUD_API_ENDPOINT,
//     url: 'https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e&symbols=ndaq,spy,vxx,ndaq',
    
//     headers: {
//       'Accept': 'text/event-stream'
//     },
//     qs: {
//       token: IEX_CLOUD_API_KEY,
//       symbols: 'ndaq,vxx,pcg'
//     }
//   })
//   ).pipe(res);
// });

// app.listen(3001, () => {
//   console.log('Server listening on port 3001');
// });


var stream;
var partialMessage;

function connect() {
  stream = request({
    url: 'https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e&symbols=ndaq,spy,vxx,ndaq',
    headers: {
      'Accept': 'text/event-stream'
    }
  })
}
connect();

stream.on('socket', () => {
  console.log("Connected");
});

stream.on('end', () => {
  console.log("Reconnecting");
  connect();
});

stream.on('complete', () => {
  console.log("Reconnecting");
  connect();
});

stream.on('error', (err) => {
  console.log("Error", err);
  connect();
});

stream.on('data', (response) => {
  var chunk = response.toString();
  var cleanedChunk = chunk.replace(/data: /g, '');

  if (partialMessage) {
    cleanedChunk = partialMessage + cleanedChunk;
    partialMessage = "";
  }

  var chunkArray = cleanedChunk.split('\r\n\r\n');
  // var chunkArray = cleanedChunk.split('\r\n\r\n');

  chunkArray.forEach(function (message) {
    if (message) {
      try {  
        var quote = JSON.parse(message)[0];
        console.log(quote);
      } catch (error) {
        partialMessage = message;
      }
    }
  });
});

function wait () {
  setTimeout(wait, 1000);
};

wait();