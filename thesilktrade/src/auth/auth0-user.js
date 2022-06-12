import axios from "axios";
import { useEffect, useState } from "react";
import API_URL from "../utils/apiurl";
import getAuthHeaders from "./auth0-headers";
import { useAuth0 } from "@auth0/auth0-react";

function postDefaultProfile(auth0User, auth0Headers, profileCallback) {
    axios.put(`${API_URL}/user/profile`, {
        name: auth0User.name,
        email: auth0User.email
    }, { headers: auth0Headers})
    .then(res => {
        let userProfile = res.data;
        profileCallback(userProfile);
    })
    .catch(err => console.log("Error posting default user profile!", err));
}

async function queryUserProfile(auth0, profileCallback) {
    const { user } = auth0;
    const auth0Headers = await getAuthHeaders(auth0);
    if (!auth0Headers)
        return;
    
    axios.get(`${API_URL}/user/profile`, { headers: auth0Headers})
    .then(res => {
        profileCallback(res.data);
    })
    .catch(err => {
        if (err.response.status === 400) {
            postDefaultProfile({ name: user.name, email: user.email}, auth0Headers, profileCallback);
        }
        else {
            console.log("Error querying user profile!", err);
        }
    })
}

function useUserProfile() {
    const auth0 = useAuth0();
    const { isAuthenticated } = auth0;
    const [ userProfile, setUserProfile ] = useState(undefined);

    useEffect(() => {
        if (isAuthenticated && !userProfile) {
            queryUserProfile(auth0, (profile) => {
                setUserProfile(profile);
            });
        }
        else if (!isAuthenticated && userProfile) {
            setUserProfile(undefined);
        }

    }, [auth0, isAuthenticated, userProfile])

    return userProfile;
}

export default useUserProfile;
