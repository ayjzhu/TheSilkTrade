import React, { useState, useEffect } from "react";
import NavbarFile from "../components/NavbarFile";
import { Container, Alert, Form, Button, Modal } from "react-bootstrap";
import './UserProfile.css';
import axios from "axios";
import API_URL from "../utils/apiurl";
import { useAuth0 } from "@auth0/auth0-react";
import getAuthHeaders from "../auth/auth0-headers";
import useUserProfile from "../auth/auth0-user";

function EditModal({ userProfile, showModal, handleSubmit, handleClose }) {
    const [ userName, setUserName] = useState(userProfile.name);
    const [ userEmail, setUserEmail] = useState(userProfile.email);
    const [ userAbout, setUserAbout] = useState(userProfile.about ?? "");
    const [ errorMessage, setErrorMessage] = useState(undefined);

    const onSubmit = () => {
        const profile = {};

        if (!userName || !(userName.trim())) {
            setErrorMessage("No name entered!");
            return;
        }
        profile.name = userName;

        if (!userEmail || !(userEmail.trim())) {
            setErrorMessage("No email entered!");
            return;
        }
        profile.email = userEmail;

        if (userAbout && userAbout.trim()) {
            profile.about = userAbout.trim();
        }

        handleSubmit(profile);
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" required={true}
                        value={userName} onChange={(e) => setUserName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required={true}
                        value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicAbout">
                    <Form.Label>About</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter about"
                       value={userAbout} onChange={(e) => setUserAbout(e.target.value)} />
                </Form.Group>
                { errorMessage ? 
                <Alert variant="danger" className="mt-3">
                    {errorMessage}
                </Alert> : undefined }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>   
    )
}

async function postUpdatedProfile(auth0, updatedProfile) {
    const auth0Headers = await getAuthHeaders(auth0);
    axios.put(`${API_URL}/user/profile`, updatedProfile,
     {headers: auth0Headers })
     .catch(err => console.log("Error updating profile!"))
}

export default function UserProfile() {
    const auth0 = useAuth0();
    const [ userProfile, setUserProfile ] = useState(undefined);
    const fetchedUserProfile = useUserProfile();
    const [ showingModal, setShowModal] = useState(false);

    useEffect(() => {
        setUserProfile(fetchedUserProfile);
    }, [fetchedUserProfile])

    if (!userProfile) {
        return <div>
            <NavbarFile />
            <h1>Loading profile!</h1>
        </div>
    }

    const updateProfile = (updatedProfile) => {
        let changedProfile = {};
        let newProfile = { ...userProfile };
        if (updatedProfile.name !== userProfile.name) {
            changedProfile.name = updatedProfile.name;
            newProfile.name = updatedProfile.name;
        }

        if (updatedProfile.email !== userProfile.email) {
            changedProfile.email = updatedProfile.email;
            newProfile.email = updatedProfile.email;
        }

        if (updatedProfile.about && 
            (!userProfile.about || updatedProfile.about !== userProfile.about)) {
            changedProfile.about = updatedProfile.about;
            newProfile.about = updatedProfile.about;
        }

        if (Object.keys(changedProfile).length > 0) {
            postUpdatedProfile(auth0, changedProfile);
            setUserProfile(newProfile);
        }
    };

    return (
        <div>
            <NavbarFile />
            <Container>
                <h1>{userProfile.name}</h1>
                <p className="text-center">{userProfile.email}</p>
                <div className="profile-container">
                            <img src="img_avatar.png" alt="Avatar" className="avatar" />
                            <br></br>
                </div>
                <Form.Group controlId="formFileSm" className="mb-3">
                            <Form.Label>Upload new image</Form.Label>
                            <Form.Control type="file" size="sm" />
                </Form.Group>
                { userProfile.about ? <>
                <h2 className="text-center">About Me</h2>
                <div className="about-me-container">
                            <p>{userProfile.about}</p>
                </div>
                </> : undefined }
                <EditModal userProfile={userProfile} showModal={showingModal} 
                    handleClose={() => setShowModal(false)} handleSubmit={(profile) => {
                        setShowModal(false);
                        updateProfile(profile);
                    }} />
                <div className="text-center mt-3">
                    <Button variant="primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
                </div>
            </Container>
        </div>
    );
}
