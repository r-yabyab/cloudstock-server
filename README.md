# cloudstock-server

NodeJS server deployed to EC2 using NGINX for handling requests from https://stockshapes-client.vercel.app/.

SSE and RESTful API endpoints are from IEX Cloud for $50 a month paid on a monthly basis. I chose this provider because it offers real time data for a reasonable price. Free stock APIs tend to provide only 15 minute delayed quotes with limited api calls per second.
The main reason for this app was to implement futures data (ES and NQ), but due to their steep licensing fees, it's not within my best interest at the moment. As for now, it serves as a real time stock tracking webapp with transparency.