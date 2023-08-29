const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");




//singup controller
exports.signUp = async (req, res) => {
  try {
    //get data from request's body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    
    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      // !contactNumber ||
      !otp ||
      !accountType
      ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // match both password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password value does not match,please try again"
      });
    }

    //check user already exist or not 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most recent otp for the email
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    // console.log(recentOtp);

    //validate OTP
    if (recentOtp.length === 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "OTP not Found",
      });
    } else if (otp !== recentOtp[0].otp) {
      //invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    //Create the Additional Profile For User
    const profileDetils = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetils._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
  

    //return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registred ,Please try again!"
    })
  }
}

//login controller for authenticating users
exports.login = async (req, res) => {
  try {
    //data fetch 
    const { email, password } = req.body;

    //validation on email and password
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: 'Please fill all the details carefully',
      });
    }

    //Find user with provided email
    let user = await User.findOne({ email }).populate("additionalDetails");

    //If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: "User is not registered with us ,Please signup first",
      })
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // user = user.toObject();

      // Save token to user document in database
      user.token = token;
      user.password = undefined;

      //Set cookie for token and return success response
      let options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie('token', token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Logged in successfully",
      });

    }
    else {
      //password do not matched
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  }
  catch (error) {
    console.log(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: "Login Failure,Please try again",
    });
  }
};


//sendOtp controller
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user already exist
    const checkUserPrsent = await User.findOne({ email });

    //if user already exist ,then return a response
    if (checkUserPrsent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    // console.log("OTP generated", otp);

    //check unique otp or not 
    const result = await OTP.findOne({ otp: otp });
    // console.log("Result is Generate OTP Func");
    // console.log("OTP", otp);
    // console.log("Result", result);
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        // lowerCaseAlphabets: false,
        // specialChars: false,
      })
      // result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };

    //creat an entry in db for otp 
    const otpBody = await OTP.create(otpPayload);
    // console.log("OTP Body", otpBody);

    //return response successfully
    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    })
  }
  catch (error) {
    console.log("Error during creating OTP", error);
    return res.staturs(500).json({
      success: false,
      message: error.message,
    })
  }
}



//changepassword controller
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};