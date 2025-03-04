import React, { useState, useEffect, useCallback } from 'react'; 
import { Container, Row, Col, Button, Card, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import AppNavbar from '../components/navbar';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [balance, setBalance] = useState(10000); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSellInput, setShowSellInput] = useState(null);
    const [sellAmount, setSellAmount] = useState(0);
    const [initialPortfolioValue, setInitialPortfolioValue] = useState(null); 
    const [sellMessage, setSellMessage] = useState(null);

    
    const fetchPortfolio = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');
            
            const response = await axios.get('http://localhost:5000/portfolio/portfolio', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const portfolioWithPrices = await Promise.all(response.data.portfolio.map(async (stock) => {
                const updatedStock = await fetchStockPrice(stock, token);
                return updatedStock;
            }));

            setPortfolio(portfolioWithPrices);
            setBalance(response.data.capital || 10000);  

            if (initialPortfolioValue === null) {
                const initialStockValue = portfolioWithPrices.reduce((total, stock) => total + stock.quantity * (stock.currentPrice || 0), 0);
                setInitialPortfolioValue(response.data.capital + initialStockValue); 
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching portfolio:', err);
            setError('Error fetching portfolio data');
            setLoading(false);
        }
    }, [initialPortfolioValue]); 

    useEffect(() => {
        fetchPortfolio();  
    }, [fetchPortfolio]);  

    const fetchStockPrice = async (stock, token) => {
        try {
            const stockResponse = await axios.get(`http://localhost:5000/stocks/stock/${stock.symbol}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return {
                ...stock,
                currentPrice: stockResponse.data.price || stock.averagePrice, 
                previousPrice: stockResponse.data.previousClose || stock.averagePrice, 
            };
        } catch (err) {
            console.error(`Error fetching data for ${stock.symbol}:`, err);
            return { ...stock, currentPrice: stock.averagePrice, previousPrice: stock.averagePrice };
        }
    };

    const handleSellClick = (symbol) => {
        setShowSellInput(symbol);
    };

    const handleSellConfirm = async (symbol) => {
        if (sellAmount <= 0) return alert('Invalid sell amount');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/portfolio/portfolio/sell', 
                                { symbol, quantity: parseInt(sellAmount), salePrice: getStockPrice(symbol) },
                                {headers: {'Authorization': `Bearer ${token}`}},
            );

            setSellMessage(`Sold ${sellAmount} shares of ${symbol}`);
            setTimeout(() => {
                setSellMessage(null);
            }, 3000);
            setShowSellInput(null);
            setSellAmount(0);
            fetchPortfolio();  
        } catch (err) {
            alert('Error selling stock');
        }
    };

    const getStockPrice = (symbol) => {
        const stock = portfolio.find(stock => stock.symbol === symbol);
        return stock ? stock.currentPrice : 0;
    };

    if (loading) return <p className="text-center text-white">Loading...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    const portfolioValue = portfolio.reduce((total, stock) => total + stock.quantity * (stock.currentPrice || 0), 0);
    const totalPortfolioValue = balance + portfolioValue;

    const growthPercentage = initialPortfolioValue > 0
        ? (totalPortfolioValue - 10000) /  100
        : 0;

    const growthPercentageColor = growthPercentage > 0
        ? 'green'
        : growthPercentage < 0
        ? 'red'
        : 'white';

    const calculateStockGrowth = (currentPrice, previousPrice) => {
        return previousPrice > 0
            ? ((currentPrice - previousPrice) / previousPrice) * 100
            : 0;
    };

    return (
        <Container className="mt-4 bg-dark text-white">
            <AppNavbar />
            <Row className="mt-4">
                <Col md={6}>
                    <Card className="mb-4 bg-dark text-white">
                        <Card.Body>
                            <h3>Portfolio Balance</h3>
                            <p>Balance: ${balance.toLocaleString()}</p>
                            <p>
                                Portfolio Value: ${totalPortfolioValue.toFixed(2)}
                                <span
                                    style={{
                                        color: growthPercentageColor,
                                        fontWeight: 'bold',
                                        marginLeft: '8px'
                                    }}
                                >
                                    ({growthPercentage.toFixed(2)}%)
                                </span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={12}>
                {sellMessage && (
                <Alert variant="success" className="text-center">
                    {sellMessage}
                </Alert>
            )}
                    <Card className="mb-4 bg-dark text-white">
                        <Card.Body>
                            <h3>Your Stocks</h3>
                            {portfolio.length === 0 ? (
                                <p className="text-center  text-white">You currently have no investments. Start exploring the market to build your portfolio.</p>
                            ) : (
                                <Table striped bordered hover className="table-dark">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Stock Value</th>
                                            <th>Amount</th>
                                            <th>Current Value</th>
                                            <th>Growth Index (%)</th>  
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolio.map((stock) => {
                                            const stockGrowth = calculateStockGrowth(stock.currentPrice, stock.previousPrice);
                                            return (
                                                <tr key={stock.symbol}>
                                                    <td>{stock.companyName}</td>
                                                    <td>${(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                                                    <td>{stock.quantity}</td>
                                                    <td>${stock.currentPrice.toFixed(2)}</td>
                                                    <td
                                                        style={{
                                                            color: stockGrowth > 0 ? 'green' : stockGrowth < 0 ? 'red' : 'white',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {stockGrowth.toFixed(2)}%
                                                    </td>
                                                    <td className="d-flex align-items-center">
                                                        <Button variant="outline-success" href={`/stocks/${stock.symbol}`} className="me-2 py-0">
                                                            Buy
                                                        </Button>
                                                        {showSellInput === stock.symbol ? (
                                                            <div className="d-flex align-items-center ms-3">
                                                                <input
                                                                    type="number"
                                                                    value={sellAmount}
                                                                    onChange={(e) => setSellAmount(e.target.value)}
                                                                    placeholder="Amount"
                                                                    className="form-control w-auto mb-2 text-light bg-dark py-0"
                                                                    style={{ maxWidth: '80px', fontSize: '0.8rem', height: '30px' }}
                                                                />
                                                                <Button
                                                                    variant="outline-danger"
                                                                    onClick={() => handleSellConfirm(stock.symbol)}
                                                                    disabled={sellAmount <= 0 || sellAmount > stock.quantity}
                                                                    className="ms-2 py-0"
                                                                    style={{ fontSize: '0.8rem', height: '30px' }}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button variant="outline-danger" onClick={() => handleSellClick(stock.symbol)} className="py-0 ms-2">
                                                                Sell
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Portfolio;
