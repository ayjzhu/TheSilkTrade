const generateUUID = require('../util/genuuid');
const UserModel = require('../models/user');
const fileToBuffer = require('../util/uploadimage').fileToBuffer;

function getUserID(req, res) {
    const sub = req.authsub;
    UserModel.findOne({ authId: sub }).then(userDoc => {
        return userDoc ? userDoc.toObject() : undefined;
    })
    .then(user => {
        if (!user) {
            res.status(400).json({ error: "No ID associated with the user!" });
        }
        else {
            res.status(200).json({ id: user.id });
        }
    })
    .catch(err => console.log("Error getting user from MongoDB!", err));
}

function getClientUserProfile(req, res) {
    const sub = req.authsub;
    UserModel.findOne({ authId: sub }).then(userDoc => {
        return userDoc ? userDoc.toObject() : undefined;
    })
    .then(user => {
        if (!user) {
            res.status(400).json({ error: "No profile associated with the user!" });
        }
        else {
            // Delete mongo data.
            delete user._id;
            delete user.__v;
            res.json(user);
        }
    })
    .catch(err => console.log("Error getting user from MongoDB!", err));
}

function getExternalUserProfile(req, res) {
    const uuid = req.params.uuid;
    let authId = undefined;
    if (req.isAuthenticated)
        authId = req.authsub;
        
    UserModel.findOne({ id: uuid })
             .then(userDoc => userDoc ? userDoc.toObject() : undefined)
             .then(user => {
                if (user) {
                    delete user._id;
                    delete user.__v;

                    // Hide authId and email from external users
                    if (!authId || user.authId != authId) {
                        delete user.authId;
                        delete user.email;
                    }

                    res.json(user);
                }
                else {
                    res.status(400).json({ error: `No user with UUID ${uuid} exists!`});
                }
             });
}

function mergeProfile(existingProfile, newProfile) {
    let mergedProfile = {
        authId: existingProfile.authId,
        name: newProfile.name || existingProfile.name,
        email: newProfile.email || existingProfile.email
     };

     if (existingProfile.id) {
        mergedProfile.id = existingProfile.id;
     }

    if (newProfile.about || existingProfile.about) {
        mergedProfile.about = newProfile.about || existingProfile.about;
    }

    if (existingProfile.image) {
        mergedProfile.image = existingProfile.image;
    }

    return mergedProfile;
}

async function updateProfile(req, res) {
    const newProfile = req.body;
    const sub = req.authsub;
    const userDoc = await UserModel.findOne({ authId: sub });

    let mergedProfile = {};
    let overwrite = false;

    if (userDoc) {
        const user = userDoc.toObject();
        mergedProfile = mergeProfile(user, newProfile);
        overwrite = true;
    }
    else { 
        mergedProfile = mergeProfile({ authId: sub }, newProfile);
    }

    if (!mergedProfile.id) {
        mergedProfile.id = generateUUID();
    }

    if (!mergedProfile.authId) {
        mergedProfile.authId = sub;
    }

    if (!mergedProfile.name) {
        res.status(400).json({ error: "Missing name!" });
        return;
    }

    if (!mergedProfile.email) {
        res.status(400).json({ error: "Missing email!" });
        return;
    }

    if (req.file) {
        mergedProfile.image = fileToBuffer(req.file);
    }

    if (overwrite) {
        userDoc.overwrite(mergedProfile).save();
    }
    else {
        new UserModel(mergedProfile).save();
    }
    res.json(mergedProfile);
}

module.exports = {
    getUserID,
    getClientUserProfile,
    getExternalUserProfile,
    updateProfile
}