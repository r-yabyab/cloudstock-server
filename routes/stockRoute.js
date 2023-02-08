const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_URL='https://ryabyab.iex.cloud/v1/data/core/quote/'

// router.get("/list", async (req, res, next) => {
//     console.log("/list call");
//     try {
//         const response = await axios.get('https://ryabyab.iex.cloud/v1/ref-data/iex/symbols?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e');
//         res.json(response.data);
//     }
//     catch(err) {
//         next(err)
//     }
// })

// router.get('/ticker', async (req, res, next) => {
//     try {
//         const response = await axios.get('https://ryabyab.iex.cloud/v1/data/core/quote/AAPL?token=sk_4b6ebe9d84b44fe48cbf602d2c70884e')
//         res.json(response.data)
//     }
//     catch(err) {
//         next(err)
//     }
// })



// router.get('/stocklist', async (req, res, next) => {
//     const stockList = req.query.yourstocks;




//     if (Array.isArray(stockList)) {
//         let tempStockData = [];
    
//         let promises = [];
//         stockList.map((stock) => (
//             promises.push(
//                 axios
//                     .get(`${BASE_URL}${stock.symbol}${TOKEN}`)
//                     .then((response) => {
//                         tempStockData.push({
//                             symbol: stock.symbol,
//                             id: stock.id,
//                             ...response.data
//                         });
//                     })
//                     .catch((error) => {
//                         console.error("Error", error.message);
//                     })
//             )
//         ));
    
//         Promise.all(promises)
//             .then(() => {
//                 res.send({ stockData: tempStockData });
//             })
//             .catch((error) => {
//                 console.error("Error", error.message);
//             });
//     } else {
//         next(new Error('Stock list is not an array'));
//     }
// });


router.get('/news', (req, res) => {
    // console.log(req.query.yourStocks)
    const getStockData = (stock) => {
            return axios
                .get(`${BASE_URL}${stock.stock}${process.env.IEX_KEY}`)
                .catch((error) => {
                    console.error("Error", error.message)
                })
        }
    
        // useEffect(() => {
            let tempStockData = []
            // const stockList = ["AAPL", "MSFT", "TSLA", "PCG", "AMZN"];
            // const stockList = (yourStocks.symbol)
            const stockList = req.query.yourStocks
    
    
            let promises = [];
            if (stockList) {
            stockList.map((stock) => (
                promises.push(
                    getStockData(stock)
                        .then((res) => {
                            tempStockData.push({
                                symbol: stock.stock,
                                id: stock.id,
                                // symbol: stock,
                                ...res.data
                            })
                        })
                )
            ))}
    
            Promise.all(promises).then(() => {
                // setStockData(tempStockData)
                res.json(tempStockData)
            })
    
        // }, [yourStocks, reducerValue])
})



module.exports = router;