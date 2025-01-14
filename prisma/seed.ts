import { Day, PrismaClient, UserSex, Status } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  // await prisma.admin.create({
  //   data: {
  //     id: "admin1",
  //     username: "admin1",
  //   },
  // });
  // await prisma.admin.create({
  //   data: {
  //     id: "admin2",
  //     username: "admin2",
  //   },
  // });

  await prisma.admin.upsert({
    where: { id: "admin1" }, // Check if the admin1 already exists
    update: {}, // No update necessary if the record already exists
    create: {
      id: "admin1", // Unique id
      username: "admin1", // Username
    },
  });

  await prisma.admin.upsert({
    where: { id: "admin2" }, // Check if the admin2 already exists
    update: {}, // No update necessary if the record already exists
    create: {
      id: "admin2", // Unique id
      username: "admin2", // Username
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`, // Unique ID for the teacher
        username: `teacher${i}`,
        firstName: `TName${i}`,
        lastName: `TLastName${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        img: "/me.jpg",
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 30)
        ),
      },
    });
  }

  // LESSON
  // const formatTime = (date) => {
  //   const hours = date.getHours().toString().padStart(2, "0");
  //   const minutes = date.getMinutes().toString().padStart(2, "0");
  //   return `${hours}:${minutes}`;
  // };
  // for (let i = 1; i <= 30; i++) {
  //   await prisma.lesson.create({
  //     data: {
  //       name: `Lesson${i}`,
  //       day: Day[
  //         Object.keys(Day)[
  //           Math.floor(Math.random() * Object.keys(Day).length)
  //         ] as keyof typeof Day
  //       ],
  //       startTime: formatTime(startTime),
  //     endTime: formatTime(endTime),
  //       subjectId: (i % 10) + 1,
  //       classId: (i % 6) + 1,
  //       teacherId: `teacher${(i % 15) + 1}`,
  //     },
  //   });
  // }
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const teacherIds = await prisma.teacher.findMany({ select: { id: true } });
  const subjects = await prisma.subject.findMany({ select: { id: true } });
  const classes = await prisma.class.findMany({ select: { id: true } });

  const teacherIdArray = teacherIds.map((teacher) => teacher.id);
  const subjectIds = subjects.map((subject) => subject.id);
  const classIds = classes.map((classItem) => classItem.id);

  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: formatTime(
          new Date(new Date().setHours(new Date().getHours() + 1))
        ),
        endTime: formatTime(
          new Date(new Date().setHours(new Date().getHours() + 3))
        ),
        subjectId: subjectIds[i % subjectIds.length],
        classId: classIds[i % classIds.length],
        teacherId: teacherIdArray[i % teacherIdArray.length],
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        firstName: `PName ${i}`,
        lastName: `PLastName ${i}`,

        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        img: "/me.jpg",

        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        firstName: `PName ${i}`,
        lastName: `PLastName ${i}`,

        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        img: "/me.jpg",
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 10)
        ),
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // // ATTENDANCE
  // for (let i = 1; i <= 10; i++) {
  //   await prisma.attendance.create({
  //     data: {
  //       date: new Date(),
  //       status: "PRESENT",
  //       studentId: `student${i}`,
  //       lessonId: (i % 30) + 1,
  //     },
  //   });
  // }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        // status: i % 2 === 0 ? "PRESENT" : "ABSENT",
        status: i % 2 === 0 ? Status.PRESENT : Status.ABSENT,
        studentId: `student${i}`,
        lessonId: (i % 30) + 1,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        date: new Date(),
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: (i % 5) + 1,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

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
