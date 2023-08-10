const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req's body
    const email = req.body.email;
    //check user for this email,email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success:false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    //generate token
    const token = crypto.randomBytes(20).toString("hex");    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true } // from {new:true} this we get updated user details 
      );
      console.log("DETAILS", updatedDetails);
    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    //send email containing url
    await mailSender(
      email,
      "Password Reset Link",
      `Your Link for email verification is ${url}. Please click this url to reset your password.`,
    )
    //return response
    return res.json({
      success: true,
      message: "Email sent successfully,please check email and change your password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset password email ",
    });
  }
}

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: 'Password and Confirm Password does not match',
      });
    }
    //get userdetails from db using token
    const userDetails = await User.findOne({ token: token });
    //if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    //token time check
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: "Token is expired,Plese rgenerate your token "
      });
    }

    //hash password
    const encryptedPassword = await bcrypt.hash(password, 10);

    //password update
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true },
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfull",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting the password ",
    });
  }
}  