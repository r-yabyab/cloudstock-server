require('dotenv').config()

const express = require('express')
const cors = require('cors')
const stockRoute = require('./routes/stockRoute.js')
const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
    windowMs: 5000, //1 second = 1000
    max: 6,
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

// app.get('/news', (req, res) => {
//     // console.log(req.query.yourStocks)
//     const getStockData = (stock) => {
//             return axios
//                 .get(`${BASE_URL}${stock.stock}${process.env.IEX_KEY}`)
//                 .catch((error) => {
//                     console.error("Error", error.message)
//                 })
//         }
    
//         // useEffect(() => {
//             let tempStockData = []
//             // const stockList = ["AAPL", "MSFT", "TSLA", "PCG", "AMZN"];
//             // const stockList = (yourStocks.symbol)
//             const stockList = req.query.yourStocks
    
    
//             let promises = [];
//             if (stockList) {
//             stockList.map((stock) => (
//                 promises.push(
//                     getStockData(stock)
//                         .then((res) => {
//                             tempStockData.push({
//                                 symbol: stock.stock,
//                                 id: stock.id,
//                                 // symbol: stock,
//                                 ...res.data
//                             })
//                         })
//                 )
//             ))}
    
//             Promise.all(promises).then(() => {
//                 // setStockData(tempStockData)
//                 res.json(tempStockData)
//             })
    
//         // }, [yourStocks, reducerValue])
// })



app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})



// app.get('*', (req, res) => {
//     res.status(500).json({message: "error"})
// })