// import Image from "next/image";
// import AttendanceChart from "./AttendanceChart";
// import prisma from "@/lib/prisma";

// const AttendanceChartContainer = async () => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

//   const lastMonday = new Date(today);
//   lastMonday.setDate(today.getDate() - daysSinceMonday);

//   const resData = await prisma.teacherAttendance.findMany({
//     where: {
//       date: {
//         gte: lastMonday,
//       },
//     },
//     select: {
//       date: true,
//       status: true,
//     },
//   });

//   const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
//   const attendanceMap: { [key: string]: { present: number; absent: number } } =
//     {
//       Mon: { present: 0, absent: 0 },
//       Tue: { present: 0, absent: 0 },
//       Wed: { present: 0, absent: 0 },
//       Thu: { present: 0, absent: 0 },
//       Fri: { present: 0, absent: 0 },
//     };

//   resData.forEach((item) => {
//     const itemDate = new Date(item.date);
//     const dayOfWeek = itemDate.getDay();
//     // console.log(`Parsed date: ${itemDate}, Day of week: ${dayOfWeek}`);

//     if (dayOfWeek >= 1 && dayOfWeek <= 5) {
//       const dayName = daysOfWeek[dayOfWeek - 1];

//       if (item.status === "PRESENT") {
//         attendanceMap[dayName].present += 1;
//       } else if (item.status === "ABSENT") {
//         attendanceMap[dayName].absent += 1;
//       }
//     }
//   });

//   // console.log(resData, "resData");


//   // console.log(attendanceMap, "map")
//   const data = daysOfWeek.map((day) => ({
//     name: day,
//     present: attendanceMap[day].present,
//     absent: attendanceMap[day].absent,
//   }));
//   return (
//     <div className="bg-slate-50 rounded-lg p-4 h-full">
//       <div className="flex justify-between items-cente">
//         <h1 className="text-lg font-semibold">Attendance</h1>
//         <Image src="/moreDark.png" width={20} height={20} alt="" />
//       </div>
//       <AttendanceChart data={data} />
//     </div>
//   );
// };

// export default AttendanceChartContainer;
