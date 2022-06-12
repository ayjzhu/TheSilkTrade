import React from 'react';
import NavbarFile from '../components/NavbarFile';
import {Card, Button, Col, Row, Container} from 'react-bootstrap';
import './Listings.css';

export default function Listings() {

    return (
        <div>
        <NavbarFile />
        <h1>Items in active renting</h1>
        <center><alert>(Currently unavaible) </alert></center>
        <center>Page 1 of 1</center>
        <Container>
            <br></br>
         <div className="previous-button">
        <Button as="input" type="button" value="Previous Page" />
        </div>
        <div className="next-button">
        <Button as="input"  type="button" value="Next Page" />
        </div>
        <br></br>
  <Row>
    <Col>
    <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="./assets/img/sample_items/men-wear2.jpg" />
  <Card.Body>
    <Card.Title>Men Grey</Card.Title>
    <Card.Text>
     High quality cloth.
    </Card.Text>
    <Button variant="primary" href="/MoreInfo">More Info</Button>
  </Card.Body>
    </Card>
    </Col>
    <Col>
    <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="./assets/img/sample_items/dress1.jpg" />
  <Card.Body>
    <Card.Title>Colorful dress</Card.Title>
    <Card.Text>
     Silky smooth dress.
    </Card.Text>
    <Button variant="primary" href="/MoreInfo">More Info</Button>
  </Card.Body>
    </Card>
    </Col>
    <Col>
    <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="holder.js/100px180" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
    <Button variant="primary">More Info</Button>
  </Card.Body>
</Card>
    </Col>
        
  </Row>
<br></br>
<br></br>

<div className='mb-3'>
    <alert variant = "secondary"> Want to find out more? Start shopping! </alert>
    <Button variant="secondary" href="/Listings">Go Here</Button>
</div>

</Container>

</div>

    );
}