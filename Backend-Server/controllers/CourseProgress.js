const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");


exports.updateCourseProgress = async(req,res) => {
    const {courseId, subsectionId} = req.body;
    const userId = req.user.id;

    try{
        //check if the subsection is valid
        const subsection = await SubSection.findById(subsectionId);

        if(!subsection) {
            return res.status(404).json({error:"Invalid Subsection"});
        }

        console.log("Subsection Validation Done");

        //Find the course progress document for the user and course
        let courseProgress = await CourseProgress.findOne({
            courseID:courseId,
            userId:userId,
        });
        if(!courseProgress) {
            return res.status(404).json({
                success:false,
                message:"Course Progress does not exist"
            });
        }
        else {
            console.log("Course Progress Validation Done");
      // If course progress exists, check if the subsection is already completed
      if(courseProgress.completedVideos.includes(subsectionId)) {
                return res.status(400).json({
                    error:"Subsection already completed",
                });
            }

            //Push the subsection into the completedVideos array
            courseProgress.completedVideos.push(subsectionId);
            console.log("Course Progress Push Done");
        }
        //Save the updated course progress
        await courseProgress.save();
        console.log("Course Progress Save call Done");
        return res.status(200).json({
            success:true,
            message:"Course Progress Updated Successfully",
        })
    }
    catch(error) {
        console.error(error);
        return res.status(400).json({error:"Internal Server Error"});
    }
}