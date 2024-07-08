const express = require("express");
const {registerUser,authUser,allUsers} = require("../controllers/userController");
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',authUser);
router.get('/allUsers',allUsers);

module.exports=router;