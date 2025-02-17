const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course")
const mongoose = require("mongoose");

exports.updateProfile = async (req, res) => {
  try {
    //get data 
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    //get UserId
    const id = req.user.id;
    //validations
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: true,
        message: "All fields are required during updating profile",
      });
    }
    //finding profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    //update profile
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()


    //return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during updating profile",
      error: error.message,
    });
  }
}

// delete account

exports.deleteAccount = async (req, res) => {
  try {
    // TODO: Find More on Job Schedule
    // const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);

    //get id and user
    const id = req.user.id;
    const user = await User.findById({ _id: id });

    //validations
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    //delete profile
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });
    //h.w. => unenroll user from all enrolled courses

    //delete user
    await User.findByIdAndDelete({ _id: id });

    //return response
    return res.status(200).json({
      success: true,
      message: "User Profile deleted successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error,User Profile cannot deleted successfully  ",
      error: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validation and get user details
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    };

    //return response
    return res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error,User details cannot get successfully  ",
      error: error.message,
    });
  }
};


exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

// exports.getEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.user.id
//     const userDetails = await User.findOne({
//       _id: userId,
//     })
//       .populate("courses")
//       .exec()
//     if (!userDetails) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find user with id: ${userDetails}`,
//       })
//     }
//     return res.status(200).json({
//       success: true,
//       data: userDetails.courses,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// };

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}