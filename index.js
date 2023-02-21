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

// const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/tops1second';
const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/stable/last?token=';

app.use(cors())

// SSE Stream
app.get('/stream', cors(), (req, res) => {
  // const stockList = req.query.yourStocks
  const symbols = req.query.symbols
  // console.log(symbols)
  // console.log(process.env.IEX_KEY)
  // console.log(process.env.IEX_KEY.replace('?token=', ''))


  req.pipe(request({
    // url: 'https://cloud-sse.iexapis.com/stable/tops1second{token}&symbols=ndaq,vxx',
    url: IEX_CLOUD_API_ENDPOINT,
    headers: {
      'Accept': 'text/event-stream',
      "access-control-allow-origin": "*"
    },
    qs: {
      token: `'${process.env.IEX_KEY.replace('?token=', '')}'`,
      // symbols: 'ndaq,vxx,pcg,'
      symbols: symbols
      // symbols: 'AAPL,GOOG'
    }
  })
  ).pipe(res);
});

 

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