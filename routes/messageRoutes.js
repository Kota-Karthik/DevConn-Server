const express=require('express');
const router = express.Router();
const {
    sendMessage,
    getAllMessages
}=require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/sendMessage',protect,sendMessage);
router.route('/getAllMessages/:chatId',protect,getAllMessages);

module.exports = router;