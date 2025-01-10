// enum Day {
//     MONDAY = "MONDAY",
//     TUESDAY = "TUESDAY",
//     WEDNESDAY = "WEDNESDAY",
//     THURSDAY = "THURSDAY",
//     FRIDAY = "FRIDAY",
//     SATURDAY = "SATURDAY",
//     SUNDAY = "SUNDAY"
//   }

// const dayToNumber: Record<Day, number> = {
//     MONDAY: 1,
//     TUESDAY: 2,
//     WEDNESDAY: 3,
//     THURSDAY: 4,
//     FRIDAY: 5,
    
//   };

// const currentWorkWeek = () => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();

//     const startOfWeek = new Date(today)
//     if(dayOfWeek === 0) {
//         startOfWeek.setDate(today.getDate() + 1)
//     }
//     if(dayOfWeek === 6) {
//         startOfWeek.setDate(today.getDate() + 2)
//     } else {
//         startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
//     }
//     startOfWeek.setHours(0,0,0,0);
   

//     return startOfWeek;
// }

// // export const adjustScheduleToCurrentWeek = (lessons: {title:string; start:Date; end:Date}[]):{title:string; start:Date; end:Date}[] => {
// //     const startOfWeek = currentWorkWeek();
    
// //     return lessons.map((lesson) => {
// //         const lessonDayOfWeek = lesson.start.getDay();

// //         const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

// //         const adjustedStartDate = new Date(startOfWeek);
// //         adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday)
// //         adjustedStartDate.setHours(
// //             lesson.start.getHours(),
// //             lesson.start.getMinutes(),
// //             lesson.start.getSeconds(),
// //         );
// //         const adjustedEndDate = new Date(adjustedStartDate);
// //         adjustedEndDate.setHours(
// //             lesson.end.getHours(),
// //             lesson.end.getMinutes(),
// //             lesson.end.getSeconds(),
// //         );

// //         return {
// //             title: lesson.title,
// //             start: adjustedStartDate,
// //             end: adjustedEndDate,
// //         }
// //     })
// // }
  


// //   const lessonDayNumber = dayToNumber[lessonDay as keyof typeof dayToNumber];
//   export const adjustScheduleToCurrentWeek = (lessons: { title: string; day: Day; startTime: string; endTime: string }[]): { title: string; start: Date; end: Date }[] => {
//     const startOfWeek = currentWorkWeek(); // Get the start of the current week (Monday)

//     return lessons.map((lesson) => {
//       const lessonStart = new Date(`1970-01-01T${lesson.startTime}:00Z`); // Assuming startTime is in HH:MM format
//       const lessonEnd = new Date(`1970-01-01T${lesson.endTime}:00Z`); // Assuming endTime is in HH:MM format
      
//       const lessonDay = lesson.day;
//       const lessonDayNumber = dayToNumber[lessonDay]; // Convert string enum to number
      
//       // Adjust the lesson date based on the day of the week (lesson.day)
//       const daysFromMonday = lessonDayNumber === 7 ? 6 : lessonDayNumber - 1; // Adjusting because Monday = 0 in the Date API
      
//       const adjustedStartDate = new Date(startOfWeek);
//       adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday); // Adjust the date to match the day of the lesson
//       adjustedStartDate.setHours(
//         lessonStart.getHours(),
//         lessonStart.getMinutes(),
//         lessonStart.getSeconds(),
//       );
      
//       const adjustedEndDate = new Date(adjustedStartDate);
//       adjustedEndDate.setHours(
//         lessonEnd.getHours(),
//         lessonEnd.getMinutes(),
//         lessonEnd.getSeconds(),
//       );
      
//       return {
//         title: lesson.title,
//         start: adjustedStartDate,
//         end: adjustedEndDate,
//       };
//     });
//   };
  





  enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
//   SATURDAY = "SATURDAY",
//   SUNDAY = "SUNDAY"
}

const dayToNumber: Record<Day, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
//   SATURDAY: 6,
//   SUNDAY: 7 
};

const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const startOfWeek = new Date(today);
  if (dayOfWeek === 0) {
    startOfWeek.setDate(today.getDate() + 1);
  }
  if (dayOfWeek === 6) {
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
};

// Adjust the schedule based on the current week
export const adjustScheduleToCurrentWeek = (lessons: { title: string; day: Day; startTime: string; endTime: string }[]): { title: string; start: Date; end: Date }[] => {
  const startOfWeek = currentWorkWeek(); // Get the start of the current week (Monday)

  return lessons.map((lesson) => {
    const lessonStart = new Date(`1970-01-01T${lesson.startTime}:00Z`); // Assuming startTime is in HH:MM format
    const lessonEnd = new Date(`1970-01-01T${lesson.endTime}:00Z`); // Assuming endTime is in HH:MM format

    const lessonDay = lesson.day;
    const lessonDayNumber = dayToNumber[lessonDay]; // Convert string enum to number

    // Adjust the lesson date based on the day of the week (lesson.day)
    const daysFromMonday = lessonDayNumber === 7 ? 6 : lessonDayNumber - 1; // Adjusting because Monday = 0 in the Date API

    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday); // Adjust the date to match the day of the lesson
    adjustedStartDate.setHours(
      lessonStart.getHours(),
      lessonStart.getMinutes(),
      lessonStart.getSeconds(),
    );

    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lessonEnd.getHours(),
      lessonEnd.getMinutes(),
      lessonEnd.getSeconds(),
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
