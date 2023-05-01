const express = require('express');
const axios = require('axios');
const router = express.Router();
const request = require('request')


const BASE_URL='https://ryabyab.iex.cloud/v1/data/core/quote/'
// Finnhub 60 API calls/minute
const FINNHUB_URL ='https://finnhub.io/api/v1/quote?symbol='
// const FINNHUB_URL ='https://finnhub.io/api/v1/quote?symbol=AAPL&token=cgclb4hr01qsquh3n870cgclb4hr01qsquh3n87g'

// router.get('/tickers', async (req, res) => {
//     try {
//         const response = await fetch(`https://ryabyab.iex.cloud/v1/ref-data/iex/symbols${process.env.IEX_KEY}`);
//         const json = await response.json();

//         res.json(json);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// })
const IEX_CLOUD_API_ENDPOINT = 'https://cloud-sse.iexapis.com/v1/tops?token=';

router.get('/stream', (req, res) => {
  // const stockList = req.query.yourStocks
  const symbols = req.query.symbols

  req.pipe(request({
    // url: 'https://cloud-sse.iexapis.com/stable/tops1second{token}&symbols=ndaq,vxx',
    url: IEX_CLOUD_API_ENDPOINT,
    headers: {
      'Accept': 'text/event-stream'
      // 'Content-Type': 'text/event-stream'
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

router.get('/tickers', async (req, res) => {
    try {
      const response = await axios.get(`https://ryabyab.iex.cloud/v1/ref-data/iex/symbols${process.env.IEX_KEY}`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

        // // fetch
        // router.get('/tickerquote', async (req, res) => {
        //     const {symbolName} = req.query;
        //     // console.log(symbolName)

        //     try {
        //         const response = await fetch(`https://ryabyab.iex.cloud/v1/data/core/quote/${symbolName}${process.env.IEX_KEY}`);
        //         const json = await response.json();

        //         res.json(json);
        //         // console.log(json)
        //     } catch (error) {
        //         console.error(error);
        //         res.status(500).json({ message: 'Server error' });
        //     }
        // });

        // // axios
        router.get('/tickerquote', async (req, res) => {
            const {symbolName} = req.query;

            try {
              // const response = await axios.get(`https://ryabyab.iex.cloud/v1/data/core/quote/${symbolName}${process.env.IEX_KEY}`);
              const response = await axios.get(`${FINNHUB_URL}${symbolName}${process.env.FINNHUB_KEY}`);
              res.json(response.data);
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Server error' });
            }
          });


router.get('/news', (req, res) => {
    // console.log(req.query.yourStocks)
    const getStockData = (stock) => {
            return axios
                // IEX Cloud requires $1,500 to access quotes as of mid March 2023
                // .get(`${BASE_URL}${stock.stock}${process.env.IEX_KEY}`)
                .get(`${FINNHUB_URL}${stock.stock}${process.env.FINNHUB_KEY}`)
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
              console.log('All promises resolved successfully');
              res.json(tempStockData);
            }).catch((error) => {
              console.error(`Error fetching stock data: ${error.message}`);
              res.status(500).json({ message: 'Server error' });
            });
    
        // }, [yourStocks, reducerValue])
})



module.exports = router;
