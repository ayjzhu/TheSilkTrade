import React, { useState } from 'react';

const CART_KEY = "thesilktrade-cart";

function loadCartFromSessionStorage() {
    const cartString = window.sessionStorage.getItem(CART_KEY);
    if (!cartString) {
      return [];
    }

    return JSON.parse(cartString);
}

function saveCartToStorage(cart) {
    if (cart.length > 0) {
        window.sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    else {
        window.sessionStorage.removeItem(CART_KEY);
    }
}

function useCart() {
    const [ cart, setCart] = useState(loadCartFromSessionStorage());

    const modifyCart = (newCart) => {
        saveCartToStorage(newCart);
        setCart(newCart);
    }

    return [ cart, modifyCart ];
}

export default useCart;