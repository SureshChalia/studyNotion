const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //fetch data from the body
    const { sectionId, title,  description } = req.body;
    //extract file/video
    const video = req.files.video;
    //validation
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required during creating a sub-section",
      });
    }
    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
    // console.log("printing upload details of sub section",uploadDetails);
    //create a sub section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      // videoUrl: uploadDetails.secure_Url,
      videoUrl: uploadDetails.secure_url,
    });
   
    //update section with this sub section objectId
    const updatedSection = await Section.findByIdAndUpdate(
       {_id:sectionId} ,
      { $push: { subSection: subSectionDetails._id }, },
      { new: true }
      ).populate("subSection");

      console.log("updated section",updatedSection);
    //return response
    return res.status(200).json({
      success: true,
      message: "Sub Section created successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during creating sub-section",
      error: error.message,
    })
  }
};

//update subsection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId,subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()
    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.json({
      success: true,
      data:updatedSection,
      message: "Section updated successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

//delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }
    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.json({
      success: true,
      data:updatedSection,
      message: "SubSection deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}