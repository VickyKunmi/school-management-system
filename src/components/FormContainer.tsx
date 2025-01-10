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
  const userId = authObject.userId;
  // const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

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

      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;

      case "lesson":
        const lessonSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        const lessonClasses = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        const lessonTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        });
        const lessonExams = await prisma.exam.findMany({
          select: {
            id: true,
            title: true,
          },
        });
        const lessonAssignment = await prisma.assignment.findMany({
          select: {
            id: true,
            title: true,
          },
        });

        relatedData = {
          subjects: lessonSubjects,
          classes: lessonClasses,
          teachers: lessonTeachers,
          exams: lessonExams,
          assignments: lessonAssignment,
        };
        break;

      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: assignmentLessons };
        break;

      case "result":
        const teacherExams = await prisma.exam.findMany({
          where: {
            lesson: {
              teacherId: currentUserId!,
            },
          },
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                name: true,
              },
            },
          },
        });

        const teacherAssignments = await prisma.assignment.findMany({
          where: {
            lesson: {
              teacherId: currentUserId!,
            },
          },
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                name: true,
              },
            },
          },
        });

      
        const examStudents = await prisma.exam.findMany({
          where: {
            lesson: {
              teacherId: currentUserId!,
            },
          },
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                id: true,
                name: true,
                class: {
                  select: {
                    id: true,
                    name: true,
                    students: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        classId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        
        // Create a mapping between exam IDs and their related students
        const examStudentMapping = examStudents.map((exam) => ({
          examId: exam.id,
          lessonId: exam.lesson.id,
          students: exam.lesson.class.students.map((student) => ({
            studentId: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            classId: student.classId,
          })),
        }));
        
        const assignmentStudents = await prisma.assignment.findMany({
          where: {
            lesson: {
              teacherId: currentUserId!,
            },
          },
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                id: true,
                name: true,
                class: {
                  select: {
                    id: true,
                    name: true,
                    students: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        classId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        

        const assignmentStudentMapping = assignmentStudents.map((assignment) => ({
          assignmentId: assignment.id,
          lessonId: assignment.lesson.id,
          students: assignment.lesson.class.students.map((student) => ({
            // id: student.id,
            studentId: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            classId: student.classId,
          })),
        }));
        
        relatedData = {
          exams: teacherExams,
          assignments: teacherAssignments,
          studentsByExam: examStudentMapping,
          studentsByAssignment: assignmentStudentMapping, 
        };
        
        
        
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
