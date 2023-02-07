require('dotenv').config()

const express = require('express')
const cors = require('cors')
const stockRoute = require('./routes/stockRoute.js')
const rateLimit = require('express-rate-limit')
const axios = require("axios");

const apiLimiter = rateLimit({
    windowMs: 3000, //1 second = 1000
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    store: new rateLimit.MemoryStore(),
})


//middleware
const app = express()

app.use(express.json())
app.use(cors())
// app.use(limiter)

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//works
app.use('/api', apiLimiter, stockRoute)

// works
// app.get("/", async (req, res) => {
//     try {
//         const response = await axios.get('https://ryabyab.iex.cloud/v1/ref-data/iex/symbols?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e')
//         res.json(response.data)
//     }
//     catch (err) {
//         console.log(err)
//     }
// })

app.get('/data', (req, res) => {
    res.json({ IEX_KEY: process.env.IEX_KEY });
    });



app.listen(3001, () => {
    console.log('listening on port 3001')
    console.log(process.env.IEX_KEY)
})




app.get('*', (req, res) => {
    res.status(500).json({message: "error"})
})