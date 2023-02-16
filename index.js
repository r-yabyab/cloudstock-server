require('dotenv').config()

const express = require('express')
const cors = require('cors')
const stockRoute = require('./routes/stockRoute.js')
const rateLimit = require('express-rate-limit')
const request = require('request')
// const WebSocket = require('ws')

const apiLimiter = rateLimit({
    windowMs: 5000, //1 second = 1000
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    store: new rateLimit.MemoryStore(),
})


//middleware
const app = express()
// const server = require('http').createServer(app)
// const wss = new WebSocket.Server({ server })

app.use(express.json())
app.use(cors())
// app.use(limiter)

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

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




// app.listen(3001, () => {
//   console.log('Server listening on port 3001');
// });



// // // For displaying on terminal, use for debugging rea
var stream;
var partialMessage;

function connect() {
  stream = request({
    url: 'https://cloud-sse.iexapis.com/stable/tops1second?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e&symbols=ndaq,vxx',
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







app.get('/api/stockquotes', (req, res) => {
    res.json(quote); // quote is the parsed JSON data from the streaming API
})










// // WORKING ON THIS EXPRESS TERMINAL
// var stream;
// var partialMessage;

// function connect() {
//   stream = request({
//     url: 'https://cloud-sse.iexapis.com/stable/tops1second?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e&symbols=ndaq,vxx',
//     headers: {
//       'Accept': 'text/event-stream'
//     }
//   })
// }


// app.get('/streaming', (req, res) => {
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive'
//   });

//   connect();

//   stream.on('socket', () => {
//     console.log("Connected");
//   });
  
//   stream.on('end', () => {
//     console.log("Reconnecting");
//     connect();
//   });
  
//   stream.on('complete', () => {
//     console.log("Reconnecting");
//     connect();
//   });
  
//   stream.on('error', (err) => {
//     console.log("Error", err);
//     connect();
//   });
  
//   stream.on('data', (response) => {
//     var chunk = response.toString();
//     var cleanedChunk = chunk.replace(/data: /g, '');
  
//     if (partialMessage) {
//       cleanedChunk = partialMessage + cleanedChunk;
//       partialMessage = "";
//     }
  
//     var chunkArray = cleanedChunk.split('\r\n\r\n');
  
//     chunkArray.forEach(function (message) {
//       if (message) {
//         try {  
//           var quote = JSON.parse(message)[0];
//           console.log(quote);
//         } catch (error) {
//           partialMessage = message;
//         }
//       }
//     });
//   });
// })















//works
app.use('/api', apiLimiter, stockRoute)



app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})



// app.get('*', (req, res) => {
//     res.status(500).json({message: "error"})
// })



  
//   function wait () {
//     setTimeout(wait, 1000);
//   };
  
//   wait();