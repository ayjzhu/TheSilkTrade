import React from "react";
import NavbarFile from "../components/NavbarFile";
import { Col, Row, Container, ListGroup, Badge, Button } from "react-bootstrap";
import useCart from "../cart/useCart";
import axios from "axios";
import API_URL from "../utils/apiurl";
import { useAuth0 } from "@auth0/auth0-react";
import getAuthHeaders from "../auth/auth0-headers";

function CartItem({ cartItem, removeCart }) {
    return (
    <Container className="mb-3">
        <Row>
            <Col><b>{cartItem.name}</b></Col>
            <Col className="text-end">
                <Badge pill bg="danger" onClick={() => removeCart(cartItem)}>
                    X
                </Badge>
            </Col>
        </Row>
        <Row>
            <Col>{cartItem.description}</Col>
            <Col className="text-end"><b>${cartItem.price}{cartItem.isForRent ? "/month" : ""}</b></Col>
        </Row>
    </Container>
    );
}

async function purchaseClothing(auth0, cart) {
    if (cart.length === 0)
        return;

    const auth0Headers = await getAuthHeaders(auth0);

    cart.forEach(cartItem => {
        const urlType = cartItem.isForRent ? "rent" : "buy";
        const url = `${API_URL}/clothes/${urlType}/${cartItem.id}`;
        axios.post(url, {}, { headers: auth0Headers })
            .catch(err => console.log(`Error trying to ${urlType} a clothing item!`, err))
    });
}

function Cart() {    
    const [ cart, setCart ] = useCart();
    const auth0 = useAuth0();

    const removeFromCart = (cartItem) => {
        const newCart = cart.filter(item => item.id !== cartItem.id);
        setCart(newCart);
    }

    const buyClothing = () => {
        purchaseClothing(auth0, cart);
        setCart([]);
    }

    return (
        <div>
            <NavbarFile />
            <h1>Cart</h1>
            <Container>
                <h3 className="text-center">{cart.length} items</h3>
                <ListGroup>
                    { cart.map(cartItem => (<CartItem key={cartItem.id} cartItem={cartItem} removeCart={removeFromCart} />))}
                </ListGroup>
                { cart.length > 0 && <div className="text-center mt-3">
                    <Button variant="primary" onClick={buyClothing}>Purchase Items!</Button>
                </div> }
            </Container>
        </div>
    );
}
export default Cart;