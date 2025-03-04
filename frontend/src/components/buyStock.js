import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';

const BuyStock = ({ stockData, userBalance, onBuyStock }) => {
    const [sharesToBuy, setSharesToBuy] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const handleSharesChange = (e) => {
        setSharesToBuy(e.target.value);
        setError('');
    };

    const handleConfirmClick = async () => {
        if (parseFloat(sharesToBuy) <= 0) {
            setError('Please enter a valid number of shares');
            return;
        }

        const totalCost = stockData.price * parseFloat(sharesToBuy);

        if (totalCost > userBalance) {
            setError('Insufficient balance');
        } else {
            try {
                const response = await axios.post(
                    'http://localhost:5000/portfolio/portfolio/buy',
                    {
                        symbol: stockData.symbol,
                        companyName: stockData.name,
                        quantity: parseFloat(sharesToBuy),
                        purchasePrice: stockData.price,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log('Stock purchased:', response.data);
                onBuyStock(sharesToBuy, totalCost); 
                setSharesToBuy('');
            } catch (error) {
                console.error('Error buying stock:', error);
                setError('An error occurred while purchasing the stock. Please try again.');
            }
        }
    };

    const totalCost = stockData.price * parseFloat(sharesToBuy || 0);

    return (
        <Card className="mt-4 bg-dark text-white">
            <Card.Body>
                <h4>Buy Shares</h4>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Shares to Buy</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={sharesToBuy}
                            onChange={handleSharesChange}
                            placeholder="Enter number of shares"
                            className="bg-secondary text-white border-0 rounded-pill"
                        />
                    </Form.Group>
                    {error && <p className="text-danger">{error}</p>}

                    <div className="mb-3">
                        <p><strong>Stock Price:</strong> ${stockData.price}</p>
                        <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
                        <p><strong>Balance:</strong> ${userBalance.toFixed(2)}</p>
                    </div>

                    <Button
                        variant="success"
                        onClick={handleConfirmClick}
                        disabled={totalCost > userBalance || sharesToBuy <= 0}
                        className="rounded-pill"
                    >
                        Confirm Purchase
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default BuyStock;
