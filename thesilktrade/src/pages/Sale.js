import React, { useState } from "react";
import NavbarFile from "../components/NavbarFile";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import API_URL from "../utils/apiurl";
import { useAuth0 } from "@auth0/auth0-react";
import getAuthHeaders from "../auth/auth0-headers";
import { useHistory } from "react-router-dom";


async function submitItems(auth0, itemName, itemDescription, itemPrice) {
  const auth0Headers = await getAuthHeaders(auth0);

  if (!auth0Headers) {
      console.log("Not authenticated!");
      return;
  }

  axios.post(`${API_URL}/clothes`, {
    name: itemName,
    description: itemDescription,
    price: itemPrice,
    isForRent: false
  },
  {
      headers: auth0Headers
  }).catch(err => {
    console.log("Error submitting items for sale!", err);
  });
}

function Sale() {
  const [ itemName, setItemName] = useState("");
  const [ itemDescription, setItemDescription] = useState("");
  const [ itemPrice, setItemPrice ] = useState(0);
  const { isLoading, ...auth0 } = useAuth0();
  const isAuthenticated = auth0.isAuthenticated;
  const history = useHistory();

  const submit = (event) => {
    event.preventDefault();
    const form = event.target.parentElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitItems(auth0, itemName, itemDescription, itemPrice);
    history.push("/Listings");
  }

  if (!isAuthenticated) {
    return (
      <h2>Not Authenticated!</h2>
    );
  }

  return (
    <div>
      <NavbarFile />
      <h1>List Item for Sale</h1>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Item Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Item Name" value={itemName}
            onChange={(input) => setItemName(input.target.value)} required={true} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Item Price</Form.Label>
          <Form.Control type="number" placeholder="Enter price in $" value={itemPrice}
            onChange={(input) => setItemPrice(input.target.value)} required={true} min={1} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Item Description</Form.Label>
          <Form.Control type="text" placeholder="Enter Short Description" value={itemDescription}
            onChange={(input) => setItemDescription(input.target.value)} required={true} />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload at least 1 picture of the product</Form.Label>
          <Form.Control type="file" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="I agree to all terms and conditions" required={true}/>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={(e) => submit(e)}>
          Submit
        </Button>
      </Form>
    </div>
    )
}
export default Sale;