import React, { useState, useEffect } from 'react';
import NavbarFile from '../components/NavbarFile';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import './Listings.css';
import API_URL from "../utils/apiurl";
import axios from "axios";
import useCart from "../cart/useCart";
import { useAuth0 } from "@auth0/auth0-react";
import useUserProfile from "../auth/auth0-user";
import { useLocation } from "react-router-dom";
import fuzzysort from 'fuzzysort'

function ClotheCard({ addToCart, inCart, removeFromCart,
    canBuy, clothe, ...props }) {
  const putInCart = () => {
    const cartItem = { id: clothe.id, name: clothe.name, description: clothe.description,
       price: clothe.price, isForRent: clothe.isForRent };
    addToCart(cartItem);
  };

  const takeOutFromCart = () => {
    const cartItem = { id: clothe.id, name: clothe.name, price: clothe.price, isForRent: clothe.isForRent };
    removeFromCart(cartItem);
  }

  return (
    <Card style={{ width: '19rem' }}>
      <Card.Img variant="top" src="puffer.jpg" />
      <Card.Body>
        <Card.Title>{clothe.name}</Card.Title>
        <Card.Text>
          {clothe.description}
        </Card.Text>
        <Button variant="primary" href={`/Listing/${clothe.id}`}>More Info</Button> { /* TODO */ }
        { canBuy && <div className="cart-button">
           { inCart ? <Button secondary onClick={takeOutFromCart}>Remove from Cart</Button> :
           <Button secondary onClick={putInCart}>Add to Cart</Button> }
        </div> }
        <Card.Text><b>${clothe.price}{clothe.isForRent ? "/month" : ""}</b></Card.Text>
      </Card.Body>
    </Card>
  );
}

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function performFilter(clothes, search) {
  return fuzzysort.go(search, clothes, { key: "name"} )
    .map(clothesScore => clothesScore.obj);
}

export default function Listings(props) {

  const auth0 = useAuth0();
  const { isAuthenticated } = auth0;
  const userProfile = useUserProfile();
  const [ cart, setCart] = useCart();
  const [ clothing, setClothes ] = useState([]);
  const cartIds = new Set(cart.map(cartItem => cartItem.id));

  const query = useQuery();

  const addToCart = (cartItem) => {
    setCart([ ...cart, cartItem ]);
  };

  const removeFromCart = (cartItem) => {
    const newCart = cart.filter(item => item.id !== cartItem.id);
    setCart(newCart);
  };

  useEffect(() => {
    axios.get(`${API_URL}/clothes`).then(res => {
      let clothes = res.data;

      if (query.has("search") ) {
        const searchValue = query.get("search");
        clothes = performFilter(clothes, searchValue);
      }

      setClothes(clothes);
    })
    .catch(err => console.log("Error fetching clothes!", err));
  }, [query]);

  const canBuyItem = (item) => isAuthenticated && (userProfile && ("id" in userProfile) && userProfile.id !== item.seller.id);

  return (
    <div>
      <NavbarFile />
      <h1>Top Listings</h1>
      <Container>
        <br></br>
        {clothing.map((clothe, idx) => {
          // Split clothing into sets of 3
          return idx % 3 === 0 ? clothing.slice(idx, idx + 3) : null;
        }).filter(e => { return e; })
          .map(chunk => {
            return (
              <>
                <Row>
                  {chunk.map(clothe => (
                    <Col>
                      <ClotheCard key={clothe.id} addToCart={addToCart} removeFromCart={removeFromCart}
                       canBuy={canBuyItem(clothe)} inCart={cartIds.has(clothe.id)} clothe={clothe} />
                    </Col>
                  ))}
                </Row>
                <br></br>
                <br></br>
              </>)
          })}
      </Container>
    </div>
  );
}