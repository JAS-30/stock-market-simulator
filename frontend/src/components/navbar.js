import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const AppNavbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false); 
    const dropdownRef = useRef(null); 
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length > 0) {
                try {
                    const response = await axios.get(`http://localhost:5000/stocks/stocks/${searchQuery}`, {headers: {Authorization: `Bearer: ${token}`}});
                    setSuggestions(response.data);
                    setDropdownOpen(true); 
                } catch (error) {
                    console.error("Error fetching stock suggestions:", error);
                    setSuggestions([]); 
                }
            } else {
                setSuggestions([]); 
                setDropdownOpen(false); 
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 500); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchClick = () => {
        setDropdownOpen(false); 
    };

    const handleDropdownItemClick = () => {
        setDropdownOpen(false); 
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-4 py-3 navbar-with-shadow">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="fs-4 fw-bold text-light">
                    Stock Simulator
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />

                <Form className="d-flex mx-auto position-relative w-50">
                    <FormControl
                        type="text"
                        placeholder="Search for a stock..."
                        className="me-2 bg-secondary text-light border-0 rounded-pill px-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant="success"
                        className="rounded-pill px-4"
                        onClick={handleSearchClick} 
                    >
                        Search
                    </Button>

                    {dropdownOpen && suggestions.length > 0 && (
                        <Dropdown.Menu
                            show
                            className="w-100 mt-2 bg-dark text-light border-0 shadow"
                            ref={dropdownRef} 
                        >
                            {suggestions.map((stock) => (
                                <Dropdown.Item
                                    key={stock.symbol}
                                    as={Link}
                                    to={`/stocks/${stock.symbol}`}
                                    className="text-light bg-dark"
                                    onClick={handleDropdownItemClick} 
                                >
                                    {stock.name} ({stock.symbol})
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    )}
                </Form>

                <Navbar.Collapse id="navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link as={Link} to="/dashboard" className="text-light fw-medium px-3">
                            Dashboard
                        </Nav.Link>
                        <Nav.Link as={Link} to="/portfolio" className="text-light fw-medium px-3">
                            Portfolio
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
