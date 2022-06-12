import React from "react";
import { Button } from "react-bootstrap";
import  './Landing.css';

export default function Landing() {
    return (
        <div>
        <div className="logo-container">
            <img src="logo.png" alt="logo"/>
        </div>
        <h1><center>Rent and sell clothes online</center></h1>
        <h4><center>Get started today for free</center></h4>
        <br></br>
        <div className="mb-2">
        <Button href='/home' variant="secondary" size="lg">
            Enter Website
        </Button>
        </div>
    </div>
    );
    }