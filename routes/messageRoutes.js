const express=require('express');
const router = express.Router();
const {
    sendMessage,
    getAllMessages
}=require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/sendMessage',protect,sendMessage);
router.get('/getAllMessages/:chatId',protect,getAllMessages);

module.exports = router;