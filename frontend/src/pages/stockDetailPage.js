import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import StockChart from "../components/stockChart";
import AppNavbar from "../components/navbar";
import BuyStock from "../components/buyStock";

const StockDetail = () => {
    const { symbol } = useParams();
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userBalance, setUserBalance] = useState(10000); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/stocks/stock/${symbol}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setStockData(response.data);
            } catch (error) {
                console.error("Error fetching stock details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol, token]);

    const fetchPortfolio = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/portfolio/portfolio", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserBalance(response.data.capital || 10000); 
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    const handleBuyStock = async (sharesToBuy, totalCost) => {
        await fetchPortfolio(); 
        setSuccessMessage(`Successfully bought ${sharesToBuy} shares for $${totalCost.toFixed(2)}`);
        setTimeout(() => setSuccessMessage(""), 3000); 
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!stockData) {
        return (
            <Container className="text-center mt-5">
                <p className="text-danger">Stock data not found.</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <AppNavbar />
            <Row className="mt-4">
                <Col md={4}>
                    <Card className="p-4 text-white bg-dark">
                        <Card.Body>
                            <h2>{stockData.name}</h2>
                            <h4 className="text-success">${stockData.price}</h4>
                            <hr />
                            <p><strong>Symbol:</strong> {stockData.symbol}</p>
                            <p><strong>Market Cap:</strong> ${stockData.marketCap?.toLocaleString()}</p>
                            <p><strong>Day Low:</strong> ${stockData.dayLow}</p>
                            <p><strong>Day High:</strong> ${stockData.dayHigh}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <StockChart symbol={symbol} />
                </Col>
            </Row>

            {successMessage && (
                <Alert variant="success" className="text-center mt-4">
                    {successMessage}
                </Alert>
            )}

            <BuyStock
                stockData={stockData}
                userBalance={userBalance}
                onBuyStock={handleBuyStock}
            />
        </Container>
    );
};

export default StockDetail;
