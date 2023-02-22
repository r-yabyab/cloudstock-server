require('dotenv').config()

const express = require('express')
const cors = require('cors')
const stockRoute = require('./routes/stockRoute.js')
const rateLimit = require('express-rate-limit')
const request = require('request')
// const WebSocket = require('ws')

const port = 3001

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

// const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/tops1second';
const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/last?token=';


// SSE Stream
// vercel doesn't support this, need to run locally for now. All the REST endpoints are handled by vercel rn.
app.get('/stream', (req, res) => {
  // const stockList = req.query.yourStocks
  const symbols = req.query.symbols
  // console.log(symbols)
  // console.log(process.env.IEX_KEY)
  // console.log(process.env.IEX_KEY.replace('?token=', ''))


  req.pipe(request({
    // url: 'https://cloud-sse.iexapis.com/stable/tops1second{token}&symbols=ndaq,vxx',
    url: IEX_CLOUD_API_ENDPOINT,
    headers: {
      'Accept': 'text/event-stream'
    },
    qs: {
      token: process.env.IEX_KEY.replace('?token=', ''),
      // symbols: 'ndaq,vxx,pcg,'
      symbols: symbols
      // symbols: 'AAPL,GOOG'
    }
  })
  ).pipe(res);
  // console.log(res)
});

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