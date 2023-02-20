const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_URL='https://ryabyab.iex.cloud/v1/data/core/quote/'

router.get('/tickers', async (req, res) => {
    try {
        const response = await fetch(`https://ryabyab.iex.cloud/v1/ref-data/iex/symbols${process.env.IEX_KEY}`);
        const json = await response.json();

        res.json(json);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/tickerquote', async (req, res) => {
    const {symbolName} = req.query;
    // console.log(symbolName)

    try {
        const response = await fetch(`https://ryabyab.iex.cloud/v1/data/core/quote/${symbolName}${process.env.IEX_KEY}`);
        const json = await response.json();

        res.json(json);
        // console.log(json)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


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
