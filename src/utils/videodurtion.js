export const CalculateCourseTime = (ContentArr) => {
  // console.log("contenArr",ContentArr)
  if(ContentArr.length <= 0 )
  {
     return "Not Found"
  }
let TotalTimeInSec = 0
for(let x of ContentArr)
 {  for (let y of x.subSection)
    TotalTimeInSec += Number(y.timeDuration);
      }
  let second=0, hour=0, minutes=0 ;
// calculate min 
 minutes = Math.floor(TotalTimeInSec/60);
 second = Math.floor(TotalTimeInSec%60);
 hour = Math.floor(minutes/60);
 let remainMin = Math.floor(minutes%60);
 minutes  = remainMin ;
 return `${hour}h:${minutes}Min:${second}Sec`
}