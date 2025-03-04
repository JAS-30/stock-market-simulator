import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { username, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); 
        window.location.href = "/"; 
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px", backgroundColor: "#1c1f26", color: "white", borderRadius: "10px" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100">Login</Button>
            </Form>
            <p className="text-center mt-3">
              <span className="text-light">Don't have an account? </span>
              <Link to="/register" style={{ color: "#28a745", textDecoration: "none" }}>Sign up here</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
