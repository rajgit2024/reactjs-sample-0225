const express=require("express");
const {registerUser,loginUser,userProfile}=require("../controllers/userController")
const {jwtAuthMiddleware}=require("../middleware/authMiddleware")
const router=express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', jwtAuthMiddleware, userProfile);

module.exports= router