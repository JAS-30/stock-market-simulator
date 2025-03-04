const yahooFinance = require('yahoo-finance2').default;
yahooFinance.suppressNotices(["yahooSurvey"]); 

const searchStocks = async (req, res) => {
    const query = req.params.name; // Assuming query is sent as a URL param
    console.log(`Searching for stocks with query: ${query}`);

    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const results = await yahooFinance.search(query);
        console.log("Yahoo Finance Response:", results);

        if (!results || !results.quotes) {
            throw new Error("Invalid response from Yahoo Finance API");
        }

        const suggestions = results.quotes
            .filter(stock => stock.symbol) // Ensure symbol exists
            .map(stock => ({
                symbol: stock.symbol,
                name: stock.shortName ? stock.shortName.trim() : stock.longname?.trim() || "Unknown",  
            }))
            .filter(stock =>
                stock.name.toLowerCase().includes(query.toLowerCase()) ||  
                stock.symbol.toLowerCase().startsWith(query.toLowerCase())      
            );

        console.log("Filtered Suggestions:", suggestions);
        res.json(suggestions);
    } catch (error) {
        console.error("Error in searchStocks:", error);
        res.status(500).json({ message: "Failed to fetch stock search results", error: error.message });
    }
};


const getStockData = async (req, res) => {
    const { symbol } = req.params;

    if (!symbol) {
        return res.status(400).json({ message: "Stock symbol is required" });
    }

    try {
        // Fetch real-time stock data
        const stock = await yahooFinance.quote(symbol);

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        res.json({
            symbol: stock.symbol,
            name: stock.shortName,
            price: stock.regularMarketPrice,
            marketCap: stock.marketCap,
            dayLow: stock.regularMarketDayLow,
            dayHigh: stock.regularMarketDayHigh,
            previousClose: stock.regularMarketPreviousClose,
            open: stock.regularMarketOpen,
            volume: stock.regularMarketVolume,
        });
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ message: "Failed to fetch stock data", error: error.message });
    }
};

const getStockHistory = async (req, res) => {
    const { symbol, range } = req.params; 

    if (!symbol || !range) {
        return res.status(400).json({ message: "Stock symbol and range are required" });
    }

    try {
        const endDate = new Date();
        let startDate = new Date();

        switch (range) {
            case "1d":
                startDate.setDate(endDate.getDate() - 1);
                break;
            case "5d":
                startDate.setDate(endDate.getDate() - 5);
                break;
            case "1mo":
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case "6mo":
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case "1y":
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            case "5y":
                startDate.setFullYear(endDate.getFullYear() - 5);
                break;
            case "max":
                startDate.setFullYear(endDate.getFullYear() - 20); 
                break;
            default:
                return res.status(400).json({ message: "Invalid range provided" });
        }

        // Fetch stock history
        const history = await yahooFinance.historical(symbol, {
            period1: startDate.toISOString().split("T")[0],
            period2: endDate.toISOString().split("T")[0],
            interval: "1d",
        });

        if (!history || history.length === 0) {
            return res.status(404).json({ message: "No historical data found" });
        }

        // Format data for frontend
        const chartData = history.map((entry) => ({
            date: entry.date.toISOString().split("T")[0], // Convert Date object to string (YYYY-MM-DD)
            price: entry.close, // Use 'close' for stock value
        }));

        res.json(chartData);
    } catch (error) {
        console.error("Error fetching historical data:", error);
        res.status(500).json({ message: "Failed to fetch historical data" });
    }
};



module.exports = { getStockData, searchStocks, getStockHistory };

