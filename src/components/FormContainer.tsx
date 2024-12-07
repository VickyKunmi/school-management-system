// import prisma from "@/lib/prisma";
// import FormModal from "./FormModal";
// import { auth } from "@clerk/nextjs/server";

// export type FormContainerProps = {
//   table:
//     | "teacher"
//     | "student"
//     | "parent"
//     | "subject"
//     | "class"
//     | "lesson"
//     | "exam"
//     | "assignment"
//     | "result"
//     | "attendance"
//     | "event"
//     | "announcement"
//     | "leave"
//     | "exeat";

//   type: "create" | "update" | "delete" | "message";
//   data?: any;
//   id?: number | string;
// };

// const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
//   let relatedData = {};

//   const { sessionClaims } = auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;
//   // const currentUserId = userId as string;

//   if (type !== "delete") {
//     switch (table) {
//       case "subject":
//         const subjectTeachers = await prisma.teacher.findMany({
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//           },
//         });
//         relatedData = { teachers: subjectTeachers };
//         break;

//       case "class":
//         const classGrades = await prisma.grade.findMany({
//           select: {
//             id: true,
//             level: true,
//           },
//         });
//         const classTeachers = await prisma.teacher.findMany({
//           select: {
//             id: true,
//             firstName: true,

//             lastName: true,
//           },
//         });
//         relatedData = { teachers: classTeachers, grades: classGrades };
//         break;

//       case "teacher":
//         const teacherSubjects = await prisma.subject.findMany({
//           select: {
//             id: true,
//             name: true,
//           },
//         });

//         relatedData = { subjects: teacherSubjects };
//         break;

//       case "student":
//         const studentGrades = await prisma.grade.findMany({
//           select: {
//             id: true,
//             level: true,
//           },
//         });
//         const studentClasses = await prisma.class.findMany({
//           include: { _count: { select: { students: true } } },
//         });
//         const studentParents = await prisma.parent.findMany({
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//           },
//         });

//         relatedData = {
//           classes: studentClasses,
//           grades: studentGrades,
//           parents: studentParents,
//         };
//         break;

//       case "parent":
//         const parentStudents = await prisma.student.findMany({
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//           },
//         });

//         relatedData = {
//           students: parentStudents,
//         };
//         break;


//         // case "attendance":
//         // const teacherAttendance = await prisma.teacher.findUnique({
//         //   where: {
//         //     id: currentUserId,

//         //   },
//         //   select: {
//         //     id: true, 
//         //     firstName: true,
//         //     lastName: true,
//         //     email: true,
//         //     img: true,
//         //   },
//         // });

//         // relatedData = {
//         //   attendance: teacherAttendance,
//         // };
//         // break;



//       default:
//         break;
//     }
//   }

//   return (
//     <div className="">
//       <FormModal
//         table={table}
//         type={type}
//         data={data}
//         id={id}
//         relatedData={relatedData}
//       />
//     </div>
//   );
// };

// export default FormContainer;




import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "leave"
    | "exeat";
  
  type: "create" | "update" | "delete" | "message";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  // Await auth() to get the session claims
  const authObject = await auth();
  const sessionClaims = authObject.sessionClaims;
  
  // Access the role from session claims
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });
        relatedData = { teachers: subjectTeachers };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = { subjects: teacherSubjects };
        break;

      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        const studentParents = await prisma.parent.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });

        relatedData = {
          classes: studentClasses,
          grades: studentGrades,
          parents: studentParents,
        };
        break;

      case "parent":
        const parentStudents = await prisma.student.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });

        relatedData = {
          students: parentStudents,
        };
        break;

      // Add any other cases as needed

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
