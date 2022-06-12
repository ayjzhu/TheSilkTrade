import React, { useState } from 'react';
import NavbarFile from '../components/NavbarFile';
import { FormControl, Button, Form, Container, Col, Row, Stack } from 'react-bootstrap';
import './Home.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

function LinkButton({ href, children, ...props}) {
    const history = useHistory();
    return (
        <Button type="button" onClick={() => history.push(href)} class="btn btn-primary btn-square-md">{children}</Button>
    )
}

function Home() {
    const { isAuthenticated } = useAuth0();
    const history = useHistory();
    const [ searchQuery, setSearchQuery ] = useState("");

    const onSearchClick =() => {
        if (searchQuery) {
            history.push({
                pathname: '/Listings',
                search: "?" + new URLSearchParams({search: searchQuery}).toString()
            })
        }
    }

    return (
        <div>
            <NavbarFile />
            {/* insert the silk trade logo here */}
            <div className="logo-container">
                <img src="logo.png" alt="logo" />
            </div>

            <Container>
                <Row>
                    <Col>
                        <Form className="d-flex">
                            <FormControl
                                type="Search for Listings"
                                placeholder="Browse Listings"
                                className="me-2"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="search-button">
                                <Button as="input" type="button" value="Search"
                                onClick={onSearchClick} />
                            </div>
                        </Form>

                    </Col>
                </Row>
                {/* add vertical spacing here */}
                <br></br>
                <br></br>
                <br></br>
                <div className="three-icons">
                    <Row>
                       { isAuthenticated ? <>
                        <Col>
                            <Stack gap={2}>
                                <div className="add-box">
                                    <img src="add.png" alt="add" className="add" />
                                </div>
                                <div>
                                    <LinkButton href='/Rent'>List Item for Rent</LinkButton>
                                </div>
                            </Stack>
                        </Col>

                        <Col>
                            <Stack gap={2}>
                                <div className="usd-box">
                                    <img src="usd-circle.png" alt="usd-circle" className="usd-circle" />
                                </div>
                                <div>
                                    <LinkButton href='/Sale'>List Item for Sale</LinkButton>
                                </div>
                            </Stack>
                        </Col>
                        </> : undefined }

                        <Col>
                            <Stack gap={2}>
                                <div className="confetti-box">
                                    <img src="confetti.png" alt="confetti" className="confetti" />
                                </div>
                                <div>
                                    <button type="button" class="btn btn-primary btn-square-md">View Newest Listings</button>
                                </div>
                            </Stack>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}
export default Home;