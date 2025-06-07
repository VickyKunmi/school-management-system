import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";
import { Term } from "@prisma/client";
import PayrollView from "./forms/PayrollView";
import PayrollViewToggle from "./PayrollViewToggle";

export type FormContainerProps = {
  table:
    | "employee"
    | "admission"
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
    | "presencelog"
    | "leave"
    | "grade"
    | "enrollment"
    | "exeat"
    | "payroll"
    | "academicHistory";

  type: "create" | "update" | "delete" | "message" | "view";
  data?: any;
  id?: number | string;
  relatedData?: any;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};


 



  // Await auth() to get the session claims
  const authObject = await auth();
  const sessionClaims = authObject.sessionClaims;
  const userId = authObject.userId;
  // const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  // const systemSettings = await prisma.settings.findFirst();
  const systemSettings = await prisma.settings.findFirst({
    select: {
      academicYear: true,
      term: true,
    },
  });

  const currentAcademicYear = systemSettings?.academicYear;
  const currentTerm = systemSettings?.term;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectClasses = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        const subjectGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        relatedData = { classes: subjectClasses, allgrade: subjectGrades };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });

        relatedData = { grades: classGrades };
        break;

      case "employee":
        const teacherSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = { subjects: teacherSubjects };
        break;

      case "result":
        // Extract the selected student's ID from the data prop
        const selectedStudentId = data?.enrollmentId || id;
        if (!selectedStudentId) {
          console.error("No student selected for fetching results.");
          break;
        }

        // Fetch the student's enrollment with related class, grade, and admission info
        const studentInfo = await prisma.enrollment.findUnique({
          where: { id: selectedStudentId },
          include: {
            class: { select: { id: true, name: true } },
            grade: { select: { id: true, level: true } },
            admission: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        });

        if (!studentInfo) {
          console.error("Student not found or not enrolled.");
          break;
        }

        // Fetch subjects based on the student's class and grade
        const subjects = await prisma.subject.findMany({
          where: {
            OR: [
              { grades: { some: { id: studentInfo.grade.id } } },
              { classes: { some: { id: studentInfo.class.id } } },
            ],
          },
          select: { id: true, name: true },
        });

        // Example using Prisma in your API route or getServerSideProps

        // Pass the subjects with the student info in relatedData
        relatedData = {
          student: studentInfo,
          subjects: subjects,
        };

        break;

      case "presencelog":
        // Fetch the lessons taught by the current user
        // const teacherLessons = await prisma.lesson.findMany({
        //   where: {
        //     ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
        //   },
        //   select: {
        //     id: true,
        //     name: true,
        //     class: {
        //       select: {
        //         id: true,
        //         name: true,
        //         students: {
        //           select: {
        //             id: true,
        //             firstName: true,
        //             lastName: true,
        //             classId: true,
        //           },
        //         },
        //       },
        //     },
        //   },
        // });

        // Create a mapping between lesson IDs and their related students
        // const lessonStudentMapping = teacherLessons.map((lesson) => ({
        //   lessonId: lesson.id,
        //   lessonName: lesson.name,
        //   students: lesson.class.students.map((student) => ({
        //     studentId: student.id,
        //     firstName: student.firstName,
        //     lastName: student.lastName,
        //     classId: student.classId,
        //   })),
        // }));

        // relatedData = {
        //   lessons: teacherLessons,
        //   studentsByLesson: lessonStudentMapping,
        // };

        break;


      case "admission":
        const notEnrolledStudents = await prisma.admission.findMany({
          where: {
            enrollments: {
              none: {
                academicYear: currentAcademicYear,
                term: currentTerm,
              },
            },
          },
        });
        const enrolledStudents = await prisma.enrollment.findMany({
          where: {
            academicYear: currentAcademicYear,
            term: currentTerm,
          },
          include: {
            admission: true,
            class: true,
            grade: true,
          },
        });

        relatedData = {
          notEnrolled: notEnrolledStudents,
          enrolled: enrolledStudents,
        };
        break;
      case "enrollment":
        const allClasses = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
            gradeId: true,
          },
        });
        const allGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        relatedData = {
          classes: allClasses,
          grades: allGrades,
        };
        break;

      case "academicHistory":
        const studentEnrollments = await prisma.enrollment.findMany({
          where: { admissionId: data.id },
          include: {
            results: { include: { subject: true } },
            class: true,
            grade: true,
            admission: true,
          },
        });
        if (!studentEnrollments || studentEnrollments.length === 0) {
          console.error("No academic history found for this student.");
          break;
        }
        // Combine all results from different enrollments
        const combinedResults = studentEnrollments.flatMap(
          (enrollment) => enrollment.results
        );
        // Use admission details from the first enrollment (assuming they’re the same)
        const studentAcademicHistory = {
          ...studentEnrollments[0].admission,
          results: combinedResults,
        };
        relatedData = { student: studentAcademicHistory };
        break;

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
