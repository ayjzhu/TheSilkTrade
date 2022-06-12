const { ClothingItemModel: ClothingModel, BoughtItemModel, RentItemModel  } = require('../models/clothingitem');
const UserModel = require('../models/user');
const CommentModel = require('../models/comments');
const generateUUID = require('../util/genuuid');
const fileToBuffer = require('../util/uploadimage').fileToBuffer;

function getAllClothes(req, res) {
    ClothingModel.find().lean()
        .then(async (clothes) => {
            if (!clothes) {
                res.json([]);
                return;
            }

            let userIds = await UserModel.find({ "id": { "$in": clothes.map(clothe => clothe.sellerId) } }).lean()
            let userMap = {};
            userIds.forEach(user => { userMap[user.id] = user; });

            const clothesList = clothes.map(({ _id, __v, sellerId, ...attrs }) => {
                const seller = userMap[sellerId];
                attrs.seller = { id: sellerId };
                if (seller) {
                    const { name } = seller;
                    attrs.seller.name = name;
                }

                return attrs;
            });

            res.json(clothesList);
        });
}

function getClothe(req, res) {
    const clotheID = req.params.clotheID;
    ClothingModel.findOne({ id: clotheID}).lean()
    .then(async (clothe) => {
        if (!clothe) {
            res.status(404).json({ error: "No clothe found matching that ID!"});
        }
        else {
            const { _id, __v, sellerId, ...clotheAttrs } = clothe;

            if (!clotheAttrs.rating) {
                clotheAttrs.rating = []
            }

            const sellerObj = await UserModel.findOne({ id: sellerId }).lean();
            if (sellerObj) {
                const { name: sellerName } = sellerObj;
                clotheAttrs.seller = { name: sellerName, id: sellerId };
            }
            else {
                clotheAttrs.seller = { id: sellerId };
            }

            res.json(clotheAttrs);
        }
    });
}

function validateClotheBody(requestBody) {

    requestValidation = [ "name", "description", "price", "isForRent"];

    for (const validation of requestValidation) {
        if (!(validation in requestBody)) {
            return `Missing clothe ${validation}!`;
        }
    }

    return undefined;
}

async function submitClothe(req, res) {
    const errorValidation = validateClotheBody(req.body);
    if (errorValidation) {
        res.status(400).json({ error: errorValidation });
        return;
    }

    const clotheName = req.body.name;
    const clotheDescription = req.body.description;
    const clothePrice = req.body.price;
    const clotheIsForRent = req.body.isForRent;

    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;
    const clothingId = generateUUID();
    let images = undefined;

    // TODO Handle pictures
    if (req.files) {
        images = req.files.map(file => fileToBuffer(file));
    }

    const clothingObject = {
        id: clothingId,
        sellerId: userId,
        name: clotheName,
        description: clotheDescription,
        price: clothePrice,
        isForRent: clotheIsForRent
    };

    if (images) {
        clothingObject.pictures = images;
    }

    new ClothingModel(clothingObject).save().then(() => {
        res.status(200).json(clothingObject);
    })
    .catch(err => {
        console.log("Error saving clothing item!", err);
        res.status(400).json({ error: "Error saving clothing item!" });
    });
}

// Get clothing that the user is renting
async function getBoughtClothing(req, res) {
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;
    BoughtItemModel.find({ purchaserId: userId}).lean()
    .then(boughtClothing => {
        let clothes = boughtClothing ? boughtClothing : [];
        clothes = clothes.map(clothe => {
            delete clothe._id;
            delete clothe.__v;
            return clothe;
        });

        res.json(clothes);
    });
}

// Get clothing that the user is renting
async function getRentedClothing(req, res) {
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;
    RentItemModel.find({ renterId: userId}).lean()
    .then(rentedClothes => {
        let clothes = rentedClothes ? rentedClothes : [];
        clothes = clothes.map(clothe => {
            delete clothe._id;
            delete clothe.__v;
            return clothe;
        });

        res.json(clothes);
    });
}

async function rentClothing(req, res) {
    const clotheId = req.params.clotheID;
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;

    ClothingModel.findOne({ id: clotheId })
    .then(clotheDoc => {
        if (!clotheDoc) {
            res.status(404).json({ error: "No clothing item found matching that ID!"});
            return;
        }

        const clothe = clotheDoc.toObject();

        if (!clothe.isForRent) {
            res.status(400).json({ error: "That clothing item is not for rent!"});
            return;
        }

        if (clothe.sellerId == userId) {
            res.status(400).json({ error: "Cannot rent your own clothing!"});
            return;
        }

        new RentItemModel({
            id: clothe.id,
            sellerId: clothe.sellerId,
            renterId: userId,
            name: clothe.name,
            description: clothe.description,
            price: clothe.price,
            pictures: clothe.pictures
        }).save()
        .then((savedDoc) => {
            clotheDoc.delete();
            const rentedItem = savedDoc.toObject();
            delete rentedItem._id;
            delete rentedItem.__v;
            res.json(rentedItem);
        })
    });
}

async function buyClothing(req, res) {
    const clotheId = req.params.clotheID;
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;

    ClothingModel.findOne({ id: clotheId })
    .then(clotheDoc => {
        if (!clotheDoc) {
            res.status(404).json({ error: "No clothing item found matching that ID!"});
            return;
        }

        const clothe = clotheDoc.toObject();

        if (clothe.isForRent) {
            res.status(404).json({ error: "That clothing item is not for sale!"});
            return;
        }

        if (clothe.sellerId == userId) {
            res.status(404).json({ error: "Cannot buy your own clothing!"});
            return;
        }

        new BoughtItemModel({
            id: clothe.id,
            sellerId: clothe.sellerId,
            purchaserId: userId,
            name: clothe.name,
            description: clothe.description,
            price: clothe.price,
            pictures: clothe.pictures
        }).save()
        .then((savedDoc) => {
            clotheDoc.delete();
            const boughtItem = savedDoc.toObject();
            delete boughtItem._id;
            delete boughtItem.__v;
            res.json(boughtItem);
        })
    });
}

function getClotheComments(req, res) {
    const clotheId = req.params.clotheID;
    CommentModel.find({ clotheId: clotheId }).lean()
    .then(async (comments) => {
        if (!comments) {
            res.json([]);
        }
        else {
            let userIds = await UserModel.find({ "id": { "$in": comments.map(comment => comment.commenterId) } }).lean()
            let userMap = Object.assign({}, ...userIds.map((user) => ({ [user.id]: user})));

            res.json(comments.map(comment => {
                delete comment._id;
                delete comment.__v;
                let userId = comment.commenterId;
                delete comment.commenterId;
                comment.user = userMap[userId];
                return comment;
            }));
        }
    });
}

async function postClotheComments(req, res) {
    const clotheId = req.params.clotheID;
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;

    const clothingDoc = await ClothingModel.findOne({ id: clotheId });

    if (!clothingDoc) {
        res.status(404).json({ error: "No clothing item found matching that ID!"});
        return;
    }

    const comment = req.body.comment;

    if (!comment) {
        res.status(400).json({ error: "Missing comment!"});
        return;
    }

    new CommentModel({
        id: generateUUID(),
        commenterId: userId,
        clotheId: clotheId,
        comment
    }).save().then((savedDoc) => {
        const comment = savedDoc.toObject(); 
        delete comment.__v;
        delete comment._id;
        delete comment.commenterId;
        comment.user = userDoc.toObject();
        res.json(comment);
    })
    .catch(err => console.log("Error saving comment!", err)); 
}

async function likeClothe(req, res) {
    const clotheId = req.params.clotheID;
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;

    ClothingModel.findOne({ id: clotheId })
    .then(clotheDoc => {
        if (!clotheDoc) {
            res.status(404).json({ error: "No clothing item found matching that ID!"});
            return;
        }

        if (clotheDoc.rating && 
            (clotheDoc.rating.indexOf(userId) !== -1)) {
            
            res.status(400).json({ error: "User already liked this item!"});
            return;
        }

        if (!clotheDoc.rating) {
            clotheDoc.rating = [ userId ];
        }
        else {
            clotheDoc.rating = [ ...clotheDoc.rating, userId ];
        }

        clotheDoc.save();
    });
}

async function unlikeClothe(req, res) {
    const clotheId = req.params.clotheID;
    const userAuthId = req.authsub;
    const userDoc = await UserModel.findOne({ authId: userAuthId });

    if (!userDoc) {
        res.status(403).json({ error: "Could not find user ID for authenticated user!"});
        return;
    }

    const userId = userDoc.id;

    ClothingModel.findOne({ id: clotheId })
    .then(clotheDoc => {
        if (!clotheDoc) {
            res.status(404).json({ error: "No clothing item found matching that ID!"});
            return;
        }

        if (clotheDoc.rating && 
            (clotheDoc.rating.indexOf(userId) === -1)) {
            
            res.status(400).json({ error: "User didn't like this item!"});
            return;
        }

        if (clotheDoc.rating) {
            clotheDoc.rating = clotheDoc.rating.filter(id => userId != id);
        }

        clotheDoc.save();
    });
}

module.exports = {
    getAllClothes,
    getClothe,
    submitClothe,
    getRentedClothing,
    getBoughtClothing,
    rentClothing,
    buyClothing,
    getClotheComments,
    postClotheComments,
    likeClothe,
    unlikeClothe
}