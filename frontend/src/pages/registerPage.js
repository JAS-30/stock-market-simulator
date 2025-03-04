import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        username,
        password,
      }, {
        headers: { "Content-Type": "application/json" }
      });
  
      if (response.data.message === "User registered successfully") {
        console.log("Registration successful:", response.data);
        navigate("/login"); 
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error.response || error);
      if (error.response) {
        setError(error.response.data.message || "Something went wrong. Please try again later.");
      } else {
        setError("Network error. Please check your internet connection.");
      }
    }    
  };
  

  return (
    <div className="register-page">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px", backgroundColor: "#1c1f26", color: "white", borderRadius: "12px" }}>
          <Card.Body>
            <h2 className="text-center mb-3">Create Your Trading Account</h2>
            <p className="text-center text-light">
              Join the <strong>Stock Market Simulator</strong> and start managing a virtual portfolio.  
              Make smart trades, track real stock data, and test your investment strategies!
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100 py-2">
                Sign Up
              </Button>
            </Form>

            <p className="mt-3 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-success fw-bold" style={{ textDecoration: "none" }}>
                Log in here
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
