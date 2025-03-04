import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import AppNavbar from '../components/navbar';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token'); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token); 
                setUsername(decoded.username); 
            } catch (error) {
                console.error('Invalid token', error);
                setError('Invalid token. Please log in again.');
            }
        } else {
            setError('Please log in to view your dashboard.');
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
            return; // User canceled the deletion
        }

        try {
            const response = await axios.delete("http://localhost:5000/auth/delete-account", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                localStorage.removeItem('token'); 
                navigate('/login'); // Redirect to login page
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete your account. Please try again later.");
        }
    };

    return (
        <Container className="mt-5">
            <AppNavbar />
            <Row className="mt-4">
                <Col md={6}>
                    <Card className="mb-4 bg-dark text-white">
                        <Card.Body>
                            <h3>User Details</h3>
                            {error ? (
                                <p>{error}</p>
                            ) : (
                                <p className='mt-4'><strong>Username:</strong> {username}</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4 bg-dark text-white">
                        <Card.Body>
                            <h3>Settings</h3>
                            <Button variant="danger" onClick={handleDeleteAccount} className="w-100 mb-3 mt-4">
                                Delete Account
                            </Button>
                            <Button variant="secondary" onClick={handleLogout} className="w-100">
                                Logout
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
