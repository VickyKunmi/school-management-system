


import { PrismaClient, UserSex, Status } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  // await prisma.admin.create({
    
  //   data: {
  //     id: "admin1", 
  //     username: "admin1",
  //   },
  // });

  // GRADE
  // await prisma.grade.create({
  //   data: {
  //     level: 1, // only one grade level
  //   },
  // });

  // CLASS
  // await prisma.class.create({
  //   data: {
  //     name: "1A", // only one class
  //     gradeId: 1, 
  //     capacity: 20,
  //   },
  // });

  // SUBJECT
  // await prisma.subject.create({
  //   data: {
  //     name: "Mathematics", // only one subject
  //   },
  // });

  // TEACHER
  // await prisma.teacher.create({
  //   data: {
  //     id: "teacher1",
  //     username: "teacher1",
  //     firstName: "TName1",
  //     lastName: "TLastName1",
  //     email: "teacher1@example.com",
  //     phone: "123-456-7891",
  //     address: "Address1",
  //     img: "/me.jpg",
  //     bloodType: "A+",
  //     sex: UserSex.MALE,
  //     // subjects: { connect: [{ id: 1 }] }, // only connect one subject
  //     // classes: { connect: [{ id: 1 }] }, // only connect one class
  //     birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
  //   },
  // });

  // LESSON
  // const formatTime = (date: Date): string => {
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   return `${hours}:${minutes}`;
  // };

  // const teacherIds = await prisma.teacher.findMany({ select: { id: true } });
  // const subjectIds = await prisma.subject.findMany({ select: { id: true } });
  // const classIds = await prisma.class.findMany({ select: { id: true } });

  // const teacherIdArray = teacherIds.map((teacher) => teacher.id);
  // const subjectIdsArray = subjectIds.map((subject) => subject.id);
  // const classIdsArray = classIds.map((classItem) => classItem.id);

  // await prisma.lesson.create({
  //   data: {
  //     name: "Lesson1", 
  //     day: "MONDAY", // or any other day
  //     startTime: formatTime(new Date(new Date().setHours(new Date().getHours() + 1))),
  //     endTime: formatTime(new Date(new Date().setHours(new Date().getHours() + 2))),
  //     // subjectId: subjectIdsArray[0],
  //     // classId: classIdsArray[0],
  //     teacherId: teacherIdArray[0],
  //   },
  // });

  // PARENT
  // await prisma.parent.create({
  //   data: {
  //     id: "parentId1",
  //     username: "parentId1",
  //     firstName: "PName 1",
  //     lastName: "PLastName 1",
  //     email: "parent1@example.com",
  //     phone: "123-456-7891",
  //     address: "Address1",
  //     img: "/me.jpg",
  //     sex: UserSex.MALE,
  //   },
  // });

  // STUDENT
  // await prisma.student.create({
  //   data: {
  //     id: "student1",
  //     username: "student1",
  //     firstName: "SName 1",
  //     lastName: "SLastName 1",
  //     email: "student1@example.com",
  //     phone: "987-654-3211",
  //     address: "Address1",
  //     img: "/me.jpg",
  //     bloodType: "O-",
  //     sex: UserSex.MALE,
  //     parentId: "parentId1", // Connect to the parent created above
  //     gradeId: 1,
  //     classId: 1,
  //     birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
  //   },
  // });

  // EXAM
  // await prisma.exam.create({
  //   data: {
  //     title: "Exam 1",
  //     startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  //     endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
  //     lessonId: 1, // Connect to the lesson created above
  //   },
  // });

  // // ASSIGNMENT
  // await prisma.assignment.create({
  //   data: {
  //     title: "Assignment 1",
  //     startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
  //     dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  //     lessonId: 1, // Connect to the lesson created above
  //   },
  // });

  // // RESULT
  // await prisma.result.create({
  //   data: {
  //     score: 90,
  //     studentId: "student1",
  //     examId: 1, // or assignmentId if applicable
  //   },
  // });

  // ATTENDANCE
  // await prisma.attendance.create({
  //   data: {
  //     date: new Date(),
  //     status: Status.PRESENT, // or Status.ABSENT
  //     studentId: "student1",
  //     lessonId: 1,
  //   },
  // });

  

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
