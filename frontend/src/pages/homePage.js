import React from 'react';
import AppNavbar from '../components/navbar';  

const Home = () => {
    return (
        <div>
            <AppNavbar /> 
            
            <div className="container mt-5">
                <h1 className="text-center text-light">Welcome to the Stock Simulator</h1>
                <p className="text-center text-light">Start by searching for a stock to simulate your portfolio.</p>
            </div>
        </div>
    );
};

export default Home;
