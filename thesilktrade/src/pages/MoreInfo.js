import React, { useEffect, useState } from "react";
import NavbarFile from "../components/NavbarFile";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import API_URL from "../utils/apiurl";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import getAuthHeaders from "../auth/auth0-headers";
import useUserProfile from "../auth/auth0-user"; 

function getClotheInfo(clotheId, setClothe) {
    axios.get(`${API_URL}/clothes/${clotheId}`)
    .then(res => {
        const clotheData = res.data;
        setClothe(clotheData);
    })
    .catch(err => {
        console.error("Error fetching clothe!", err);
        setClothe(undefined);
    });
}

function getComments(clotheId, setComments) {
    axios.get(`${API_URL}/clothes/${clotheId}/comments`)
    .then(res => {
        const comments = res.data;
        setComments(comments);
    })
    .catch(err => {
        console.error("Error fetching comments!", err);
        setComments([]);
    });
}

async function postComment(clotheId, auth0, comment) {
    const auth0Headers = await getAuthHeaders(auth0);
    if (!auth0Headers) {
        console.log("Error trying to post a comment!, not authenticated!");
        return;
    }

    axios.post(`${API_URL}/clothes/${clotheId}/comment`, {
        comment
    }, { headers: auth0Headers })
    .catch(err => console.log("Error posting comment!", err));
}

async function submitToggleLikeClothe(clotheId, like, auth0) {
    const auth0Headers = await getAuthHeaders(auth0);
    if (!auth0Headers) {
        console.log("Error trying to post a comment!, not authenticated!");
        return;
    }
    const likeType = like ? "like" : "unlike";
    axios.post(`${API_URL}/clothes/${clotheId}/${likeType}`, {}, { headers: auth0Headers })
    .catch(err => console.log(`Error trying to ${likeType} clothe!`, err));
}

export default function MoreInfo(props) {
    const clotheId = props.match.params.id;

    const userProfile = useUserProfile();
    const [ isLoadingClothe, setLoadingClothe] = useState(true);
    const [ clothe, setClothe ] = useState(undefined);

    // Post comments on page after submit
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [ likedClothe, setLikedClothe] = useState(true);

    const auth0 = useAuth0();
    const { isAuthenticated, isLoading } = auth0;

    useEffect(() => {
        if(!isLoadingClothe)
            return;
        
        getClotheInfo(clotheId, (clotheData) => {
            setLoadingClothe(false);
            if (clotheData) {
                getComments(clotheId, (comments) => setComments(comments));
            }
            setClothe(clotheData);
        });
        
    }, [clotheId, isLoadingClothe]);

    useEffect(() => {
        if (clothe && isAuthenticated && userProfile) {
            setLikedClothe(clothe.rating.indexOf(userProfile.id) !== -1);
        }  
    }, [ userProfile, isAuthenticated, clothe]);

    if (isLoadingClothe) {
        return <div>
            <NavbarFile />
            <h2>Loading</h2>
        </div>;
    }

    if (!isLoadingClothe && !clothe) {
        return <div>
            <NavbarFile />
            <h2>No clothe found!</h2>
        </div>;
    }

    const likeClothe = () => {
        if (!likedClothe && isAuthenticated && clothe) {
            setLikedClothe(true);
            submitToggleLikeClothe(clotheId, true, auth0);
            clothe.rating = [ ...clothe.rating, userProfile.id];
            setClothe(clothe);
        }
    }

    const unlikeClothe = () => {
        if (likedClothe && isAuthenticated && clothe && clothe.rating) {
            setLikedClothe(false);
            submitToggleLikeClothe(clotheId, false, auth0);
            clothe.rating = clothe.rating.filter(id => id !== userProfile.id);
            setClothe(clothe);
        }
    }

    const submitComment = (e) => {
        e.preventDefault();
        if (comment.length > 0 && userProfile) {
            postComment(clotheId, auth0, comment);
            setComments([...comments, { comment, user: { name: userProfile.name } }]);
            setComment("");
        }
    }

    return (
        <div>
            <NavbarFile />
            <h1>{clothe.name}</h1>
            <h2 className="text-center">Price: ${clothe.price}{clothe.isForRent ? "/month" : ""}</h2>
            <h3 className="text-center">By {clothe.seller.name}</h3>

            <Container>
                <Row>
                    <Col>
                        <h3>Description</h3>
                        <p>
                            {clothe.description}
                        </p>
                    </Col>
                    <Col>
                        User Ratings: {clothe.rating.length}
                        {/*Button to Like Product*/}
                        <br></br>
                        { isAuthenticated &&
                            (!likedClothe ?
                         <Button variant="primary" onClick={() => likeClothe()}>Like Item</Button> :
                         <Button variant="primary" onClick={() => unlikeClothe()}>Unlike Item</Button>)
                        }
                        {/*Comment Section, post comments on page*/}

                        <br></br>
                        <h3>Comments</h3>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                { comments.map((comment, idx) => <> { idx > 0 ?  <br></br> : undefined} <Form.Label><b>{comment.user.name}: </b> {comment.comment}</Form.Label> </>) }
                                { isAuthenticated ? <Form.Control as="textarea" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />  : null }
                            </Form.Group>

                            { isAuthenticated ?  <Button variant="primary" onClick={submitComment}>Submit</Button> : null }

                        </Form>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}
