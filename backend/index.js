const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('node:path');
const fs = require("fs");
const mongoose = require('mongoose');
const { auth } = require('express-openid-connect');
const cors = require('cors');

require('dotenv').config();
const api = require("./routes/api");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // TODO DISABLE IN PRODUCTION

// Connect to MongoDB
const db = process.env.MONGO_DB_URI;
mongoose.connect(db, { dbName: "thesilktrade" },
    err => {
        if (err) 
            throw err;
        console.log("Connected to MongoDB");
    }
);

// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.AUTH0_SECRET, 
//     baseURL: 'http://localhost:3000',
//     clientID: process.env.AUTH0_CLIENT_ID,
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//     clientSecret: process.env.AUTH0_CLIENT_SECRET,
//     authorizationParams: {
//         response_type: 'code id_token',
//         scope: 'openid profile email',
//     }
// };
  
// // auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

app.use("/api", api);

const clientBuildPath = "../thesilktrade/build";

// Use client build if available
if (fs.existsSync(path.resolve(__dirname, clientBuildPath))) {
    console.log("React App Build Exists. Using that as index page...");
    app.use(express.static(path.resolve(__dirname, clientBuildPath)));

    // Homepage
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, clientBuildPath, 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log("Running application on port: " + PORT);