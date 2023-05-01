require('dotenv').config()

const express = require('express')
const cors = require('cors')
const stockRoute = require('./routes/stockRoute.js')
const rateLimit = require('express-rate-limit')
const request = require('request')
// const WebSocket = require('ws')

// for EC2 instance (http://34.218.179.6:3001/)
// as of now 2/21/23, the EC2 instance clones repository. To update...... idk yet
// on EC2, use pm2 logs 0 to see live logs
const port = 3001

const apiLimiter = rateLimit({
    windowMs: 3000, //1 second = 1000
    max: 1000,
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

// const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/tops1second';
// const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/last?token=';
const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/v1/tops?token=';
// const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/tops?token=';  // wastes a ton of tokens

// app.get('/stream', (req, res) => {
//   const symbols = req.query.symbols

//   const externalReq = request({
//     url: IEX_CLOUD_API_ENDPOINT,
//     headers: {
//       'Accept': 'text/event-stream'
//     },
//     qs: {
//       token: process.env.IEX_KEY.replace('?token=', ''),
//       symbols: symbols
//     }
//   });

//   req.on('close', () => {
//     externalReq.destroy();
//   });

//   externalReq.pipe(res);
// });

// SSE Stream
// app.get('/stream', apiLimiter, (req, res) => {
//   // const stockList = req.query.yourStocks
//   // const symbols = req.query.symbols
//   const symbols = req.query

//   req.pipe(request({
//     // url: 'https://cloud-sse.iexapis.com/stable/tops1second{token}&symbols=ndaq,vxx',
//     url: IEX_CLOUD_API_ENDPOINT,
//     headers: {
//       'Accept': 'text/event-stream',
//       // 'Content-Type': 'text/event-stream'
//     },
//     qs: {
//       token: process.env.IEX_KEY.replace('?token=', ''),
//       // symbols: 'ndaq,vxx,pcg,'
//       symbols: symbols
//       // symbols: 'AAPL,GOOG'
//     }
//   })
//   ).pipe(res);
//   // console.log(res)
// });

// SSE Stream with timeout
// app.get('/stream', apiLimiter, (req, res) => {
//   const delay = 10000; // Delay for 3 seconds
//   const timeoutId = setTimeout(() => {
//     const symbols = req.query.symbols;
//     req.pipe(
//       request({
//         url: IEX_CLOUD_API_ENDPOINT,
//         headers: {
//           // 'Accept': 'text/event-stream'
//           'Content-Type': 'text/event-stream'
//         },
//         qs: {
//           token: process.env.IEX_KEY.replace('?token=', ''),
//           symbols: symbols
//         }
//       })
//     ).pipe(res);
//   }, delay);

//   req.on('close', () => {
//     clearTimeout(timeoutId); // Cancel the setTimeout if the request is closed before the delay
//   });

//   req.on('end', () => {
//     clearTimeout(timeoutId); // Cancel the setTimeout if the request ends before the delay
//   });

//   setTimeout(() => {
//     req.destroy(); // Force close the connection
//   }, delay);
// });


// // last output
// {
//   symbol: 'NDAQ',
//   price: 56.72,
//   size: 25,
//   time: 1677005429924,
//   seq: 1421
// }

// // tops output
// {
//   symbol: 'NDAQ',
//   sector: 'n/a',
//   securityType: 'n/a',
//   bidPrice: 52.42,
//   bidSize: 180,
//   askPrice: 56.72,
//   askSize: 300,
//   lastUpdated: 1677005513893,
//   lastSalePrice: 56.715,
//   lastSaleSize: 10,
//   lastSaleTime: 1677005500079,
//   volume: 98521,
//   seq: 13182
// }
 

//works
app.use('/api', apiLimiter, stockRoute)



app.listen(port, () => {
    console.log('Listening on port', port)
})



// app.get('*', (req, res) => {
//     res.status(500).json({message: "error"})
// })



  
//   function wait () {
//     setTimeout(wait, 1000);
//   };
  
//   wait();