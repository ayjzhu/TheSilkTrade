const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothingcontroller');
const { validateAuth, checkAuth} = require('../middleware/auth-middleware');

router.get('/', clothingController.getAllClothes);
router.post('/', validateAuth, clothingController.submitClothe);
router.get('/rented', validateAuth, clothingController.getRentedClothing);
router.post('/rent/:clotheID', validateAuth, clothingController.rentClothing);
router.get('/bought', validateAuth, clothingController.getBoughtClothing);
router.post('/buy/:clotheID', validateAuth, clothingController.buyClothing);
router.get('/:clotheID/comments', clothingController.getClotheComments);
router.post('/:clotheID/comment', validateAuth, clothingController.postClotheComments);
router.post('/:clotheID/like', validateAuth, clothingController.likeClothe);
router.post('/:clotheID/unlike', validateAuth, clothingController.unlikeClothe);
router.get('/:clotheID', clothingController.getClothe);

module.exports = router