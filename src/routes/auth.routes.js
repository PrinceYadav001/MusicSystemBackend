const express = require("express");
const authController = require("../controllers/auth.controller");
const validationRule = require("../middlewares/validation.middleware");

const router = express.Router();


router.post("/register" ,validationRule.registerUserValidationRules, authController.registerUser);
router.post("/login" , authController.loginUser);

router.post("/logout" , authController.logoutUser);



module.exports = router;