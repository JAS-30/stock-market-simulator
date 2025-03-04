import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import { ButtonGroup, Button } from "react-bootstrap";

const StockChart = ({ symbol }) => {
    const [chartData, setChartData] = useState([]);
    const [timeRange, setTimeRange] = useState("1mo"); 
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/stocks/stock/${symbol}/history/${timeRange}`, {headers: {Authorization: `Bearer ${token}`}});
                const rawData = response.data;

                if (rawData && rawData.length) {
                    const filteredData = rawData.filter((_, index) => index % Math.ceil(rawData.length / 8) === 0); // Show ~8 labels max
                    setChartData(filteredData);
                }
            } catch (error) {
                console.error("Error fetching stock history:", error);
            }
        };

        fetchChartData();
    }, [symbol, timeRange, token]); 

    return (
        <div className="chart-container">
            <h4 className="text-center mb-3">Stock Performance</h4>

            <ButtonGroup className="mb-3 d-flex justify-content-center">
                {["1d", "5d", "1mo", "6mo", "1y", "5y", "max"].map((range) => (
                    <Button
                        key={range}
                        variant={timeRange === range ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => setTimeRange(range)}
                    >
                        {range.toUpperCase()}
                    </Button>
                ))}
            </ButtonGroup>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "white" }}
                        tickFormatter={(tick) => tick.slice(-5)}
                    />
                    <YAxis tick={{ fill: "white" }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ backgroundColor: "#1c1f26", color: "white", borderRadius: "5px" }} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <Line type="monotone" dataKey="price" stroke="#00c853" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockChart;
