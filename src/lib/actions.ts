"use server";
import { Prisma, Term } from "@prisma/client";
import {
  SubjectSchema,
  ClassSchema,
  AdmissionSchema,
  EnrollmentSchema,
  ResultSchema,
  GradeSchema,
  EmployeeSchema,
  payrollSchema,
  PayrollSchema,
  AttendanceSchema,
} from "./formValidationSchema";
import prisma from "./prisma";
import { clerkClient, auth } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean; message?: string };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        classes: {
          connect: data.classes?.map((classId: string) => ({
            id: parseInt(classId),
          })),
        },
        grades: {
          connect: data.grades?.map((gradeId: string) => ({
            id: parseInt(gradeId),
          })),
        },
      },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  console.log("Received update data:", data);

  try {
    await prisma.subject.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
        classes: {
          set: data.classes?.map((classId) => ({ id: Number(classId) })),
        },
        grades: {
          set: data.grades?.map((gradeId) => ({ id: Number(gradeId) })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Update error:", error);
    return { success: false, error: true, message: error.message };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // Delete the subject by ID
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subject"); // Uncomment when using revalidation
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createGrade = async (
  currentState: CurrentState,
  data: GradeSchema
) => {
  try {
    await prisma.grade.create({
      data,
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const updateGrade = async (
  currentState: CurrentState,
  data: GradeSchema
) => {
  try {
    await prisma.grade.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const deleteGrade = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.grade.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};

export const createEmployee = async (
  currentState: CurrentState,
  data: EmployeeSchema
) => {
  let userId: string | null = null;

  try {
    const employeeId = `STAFF${Math.floor(1000 + Math.random() * 9000)}`;

    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: "staff" },
    });

    userId = user.id; // Save the Clerk-generated ID

    // Create the Employee record in your database
    // You can generate an employeeId here or use the Clerk id for both.
    const createdEmployee = await prisma.employee.create({
      data: {
        id: userId,
        employeeId,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        jobTitle: data.jobTitle,
        hireDate: data.hireDate,
        contractType: data.contractType,
        sex: data.sex,
        birthday: data.birthday,
      },
    });

    console.log("Created Employee: ", createdEmployee);

    return {
      success: true,
      error: false,
      message: "Employee Created Successfully!",
      data: createdEmployee,
    };
  } catch (error) {
    console.error("Error occurred during creation:", error);

    // Rollback the Clerk user if Prisma operation fails
    if (userId) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(userId);
      } catch (rollbackError) {
        console.error("Failed to rollback Clerk user:", rollbackError);
      }
    }

    // Handle Clerk-specific errors
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0];
        if (clerkError.code === "form_identifier_exists") {
          return {
            success: false,
            error: true,
            message:
              clerkError.message ||
              "That username is taken. Please try another.",
          };
        }
      }
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0];
          const message =
            field.charAt(0).toUpperCase() + field.slice(1) + " already exists";
          return { success: false, error: true, message };
        }
      }
      return {
        success: false,
        error: true,
        message: "There was an issue with the database operation",
      };
    }

    return {
      success: false,
      error: true,
      message: "An error occurred while creating the employee!",
    };
  }
};

export const updateEmployee = async (
  currentState: CurrentState,
  data: EmployeeSchema
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Employee ID is missing!" };
  }

  try {
    const client = await clerkClient();
    // Update the Clerk user details
    await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Fetch the existing employee record
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: data.id },
    });

    if (!existingEmployee) {
      return { success: false, error: true, message: "Employee not found!" };
    }

    // Prepare the update payload for Prisma
    const updateData = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      img: data.img,
      jobTitle: data.jobTitle,
      hireDate: data.hireDate,
      contractType: data.contractType,
      sex: data.sex,
      birthday: data.birthday,
      // Note: if you have fields that shouldn’t be updated, handle them here.
    };

    const updatedEmployee = await prisma.employee.update({
      where: { id: data.id },
      data: updateData,
    });

    console.log("Updated Employee: ", updatedEmployee);
    return {
      success: true,
      error: false,
      message: "Employee updated successfully!",
      data: updatedEmployee,
    };
  } catch (error) {
    console.error("Error occurred during update:", error);

    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0];
        if (clerkError.code === "form_identifier_exists") {
          return {
            success: false,
            error: true,
            message:
              clerkError.message ||
              "That username is taken. Please try another.",
          };
        }
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0];
          const message =
            field.charAt(0).toUpperCase() + field.slice(1) + " already exists";
          return { success: false, error: true, message };
        }
      }
      return {
        success: false,
        error: true,
        message: "There was an issue with the database operation",
      };
    }

    return {
      success: false,
      error: true,
      message: "Unable to update employee!",
    };
  }
};

export const deleteEmployee = async (currentState: any, data: FormData) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    // Delete the Clerk user
    await client.users.deleteUser(id);

    // Delete the employee record from the database
    await prisma.employee.delete({
      where: { id },
    });

    return {
      success: true,
      error: false,
      message: "Employee deleted successfully!",
    };
  } catch (err) {
    console.error("Error occurred during deletion:", err);
    return {
      success: false,
      error: true,
      message: "Failed to delete employee!",
    };
  }
};

export const createAttendance = async (data: AttendanceSchema) => {
  try {
    const expiresAt = new Date(new Date().getTime() + 10 * 60 * 1000);

    // Check if attendance already exists for the teacher and date
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: data.employeeId,
        date: data.date,
        signOutTime: null, // only consider records that haven't been signed out yet
      },
    });

    if (existingAttendance) {
      // If attendance exists and is not signed out yet, update the sign-in or sign-out times as needed
      // Check if sign-in is already done, then update sign-out time if needed
      if (existingAttendance.signInTime && !existingAttendance.signOutTime) {
        return updateSignOutTime(data.employeeId);
      }
      return {
        success: false,
        error: true,
        message: "Attendance already recorded for this date and teacher",
      };
    }

    // Create new attendance if no record found
    await prisma.attendance.create({
      data: {
        employee: {
          connect: { id: data.employeeId },
        },
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        signInTime: data.signInTime,
        signOutTime: data.signOutTime ?? null,
        status: data.status,
        qrCode: data.qrCode,
        expiresAt: expiresAt,
      },
    });

    return {
      success: true,
      error: false,
      message: "Attendance record created successfully!",
    };
  } catch (error) {
    console.error("Error creating attendance record:", error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: true,
          message: "Attendance record already exists for the specified date.",
        };
      }
    }

    return {
      success: false,
      error: true,
      message: "An error occurred while creating the attendance record.",
    };
  }
};

export const updateSignOutTime = async (employeeId: string) => {
  try {
    const currentTime = new Date();

    // Find the most recent attendance record for the teacher where signOutTime is null
    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employeeId,
        signOutTime: null,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (!attendance) {
      return {
        success: false,
        message: "No active attendance record found for signing out.",
      };
    }

    // Update the signOutTime to mark the end of the day
    await prisma.attendance.update({
      where: { id: attendance.id },
      data: { signOutTime: currentTime },
    });

    return {
      success: true,
      message: "Sign-out time updated successfully!",
    };
  } catch (error) {
    console.error("Error updating sign-out time:", error);
    return {
      success: false,
      message: "An error occurred while updating the sign-out time.",
    };
  }
};

type QRCodeData = {
  employeeId: string;
  timestamp: string;
  uniqueId: string;
};

export const validateQRCode = async (qrCodeData: string) => {
  try {
    const {employeeId, timestamp, uniqueId }: QRCodeData =
      JSON.parse(qrCodeData);

    // Verify teacher exists
    const employee = await prisma.employee.findUnique({
      where: { id:employeeId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        img: true,
      },
    });

    if (!employee) {
      return { success: false, message: "Invalid teacher ID" };
    }

    // Verify QR code expiration
    const qrExpirationTime = new Date(timestamp);
    if (new Date() > new Date(qrExpirationTime.getTime() + 10 * 60 * 1000)) {
      return { success: false, message: "QR code has expired" };
    }

    return {
      success: true,
      message: "QR code is valid",
      data: employee,
    };
  } catch (err) {
    console.error("QR code validation failed:", err);
    return { success: false, message: "Invalid QR code format" };
  }
};

export const fetchTeacherAndAttendance = async (userId: string) => {
  try {
    const session = await auth();
    console.log("session: ", session);
    console.log("Session Claims:", session.sessionClaims);

    const role = (session?.sessionClaims?.metadata as { role?: string })?.role;
    console.log("role: ", role);

    if (!userId) {
      throw new Error("User is not authenticated");
    }

    let employee;
    let attendanceData;

    // Fetch teacher details based on role
    if (role === "admin") {
      employee = await prisma.employee.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          img: true,
        },
      });
      // If admin, handle the case where teacher is an array
      if (!employee || employee.length === 0) {
        throw new Error("No employees found");
      }
      // Admin can get a list of employees, but we set it to the first employee or null
      employee = employee.length > 0 ? employee[0] : null;
    } else {
      // Regular user (employee) sees only their own data
      employee = await prisma.employee.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          img: true,
        },
      });
      if (!employee) {
        throw new Error("Teacher not found");
      }
    }

    // Fetch attendance data based on the role
    if (role === "admin") {
      attendanceData = await prisma.attendance.findMany({
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          signInTime: true,
          signOutTime: true,
          status: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } else {
      attendanceData = await prisma.attendance.findMany({
        where: { employeeId: userId },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          signInTime: true,
          signOutTime: true,
          status: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    }

    return { employee, attendanceData, role };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching teacher and attendance data");
  }
};

export const convertToTimeString = (time: string): string | null => {
  if (!time) return null;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm format
  if (timeRegex.test(time)) return time; // Already in correct format

  try {
    const date = new Date(`1970-01-01T${time}:00Z`);
    return date.toISOString().substr(11, 5); // Extract HH:mm
  } catch (error) {
    console.error("Invalid time format:", time, error);
    return null;
  }
};

// Function to calculate grade based on score
const calculateGrade = (score: number): string => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  return "F";
};

// const createResultsForEnrollment = async (
//   enrollmentId: number,
//   academicYear: string,
//   term: Term
// ) => {
//   try {
//     const enrollment = await prisma.enrollment.findUnique({
//       where: { id: enrollmentId },
//       include: {
//         class: {
//           include: { subjects: true },
//         },
//       },
//     });

//     console.log("Fetched Enrollment:", enrollment); // Debugging log

//     if (!enrollment || !enrollment.class || !enrollment.class.subjects.length) {
//       throw new Error("No subjects found for this enrollment.");
//     }

//     const resultData = enrollment.class.subjects.map((subject) => ({
//       enrollmentId,
//       subjectId: subject.id,
//       score: 0,
//       grade: calculateGrade(0),
//       academicYear,
//       term,
//     }));

//     console.log("Creating Results Data:", resultData); // Debugging log

//     await prisma.result.createMany({
//       data: resultData,
//       skipDuplicates: true,
//     });

//     return { success: true };
//   } catch (error: any) {
//     console.error("Error creating results:", error);
//     return { success: false, error: error.message };
//   }
// };

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  const { enrollmentId, academicYear, term, results } = data;

  if (!results || results.length === 0) {
    return { success: false, error: true, message: "No results provided!" };
  }

  // Ensure the enrollment exists
  const enrollmentExists = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!enrollmentExists) {
    return { success: false, error: true, message: "Enrollment not found!" };
  }

  // Validate that each subject exists
  const subjectIds = results.map((r) => r.subjectId);
  const existingSubjects = await prisma.subject.findMany({
    where: { id: { in: subjectIds } },
    select: { id: true },
  });
  const existingSubjectIds = new Set(existingSubjects.map((s) => s.id));

  for (const result of results) {
    if (!existingSubjectIds.has(result.subjectId)) {
      return {
        success: false,
        error: true,
        message: `Subject with ID ${result.subjectId} not found!`,
      };
    }
  }

  // Prepare the data to be inserted for each subject result
  const insertData = results.map(({ subjectId, score }) => ({
    enrollmentId,
    subjectId,
    score,
    grade: calculateGrade(score),
    academicYear,
    term,
  }));

  // Insert the results in bulk
  try {
    await prisma.result.createMany({
      data: insertData,
      skipDuplicates: true, // Avoid inserting duplicates based on the unique constraint
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.error("Error creating results:", error);
    return { success: false, error: true, message: error.message };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  const { enrollmentId, academicYear, term, results } = data;

  if (!results || results.length === 0) {
    return { success: false, error: true, message: "No results provided!" };
  }

  try {
    // Run updates concurrently in a transaction.
    const updateOperations = results.map((result) => {
      return prisma.result.update({
        where: {
          enrollmentId_subjectId: {
            enrollmentId,
            subjectId: result.subjectId,
          },
        },
        data: {
          score: result.score,
          grade: calculateGrade(result.score),
          academicYear,
          term: term as Term,
        },
      });
    });

    // Wait for all updates to complete
    await prisma.$transaction(updateOperations);

    return { success: true, error: false };
  } catch (error: any) {
    console.error("Error updating results:", error);
    return { success: false, error: true, message: error.message };
  }
};

export const getStudentResults = async (admissionId: number) => {
  return await prisma.result.findMany({
    where: {
      enrollment: {
        admissionId: admissionId,
      },
    },
    include: {
      subject: { select: { name: true } },
      enrollment: {
        select: {
          academicYear: true,
          term: true,
        },
      },
    },
    orderBy: [
      { enrollment: { academicYear: "desc" } },
      { enrollment: { term: "asc" } },
    ],
  });
};

export const getSettings = async () => {
  try {
    const settings = await prisma.settings.findFirst(); // Assumes you have a 'settings' table
    if (!settings) {
      console.warn("No settings found in the database.");
      return null;
    }
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

export const updateSettings = async (academicYear: string, term: string) => {
  try {
    // Check if settings with id = 1 exist
    const existingSettings = await prisma.settings.findUnique({
      where: { id: 1 },
    });

    let settings;
    if (existingSettings) {
      settings = await prisma.settings.update({
        where: { id: 1 },
        data: { academicYear, term: term as Term }, // Use the imported enum
      });
    } else {
      settings = await prisma.settings.create({
        data: { academicYear, term: term as Term }, // Use the imported enum
      });
    }

    return {
      success: true,
      error: false,
      message: "Settings updated successfully!",
      settings,
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      success: false,
      error: true,
      message: "An error occurred while updating settings",
    };
  }
};

export const createAdmission = async (
  currentState: CurrentState,
  data: AdmissionSchema
) => {
  try {
    const admissionNumber = `TEPA${Math.floor(1000 + Math.random() * 9000)}`;

    const admission = await prisma.admission.create({
      data: {
        firstName: data.firstName,
        admissionNumber,
        lastName: data.lastName,
        middleName: data.middleName,
        address: data.address,
        parentContact: data.parentContact,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        admissionDate: data.admissionDate || new Date(),
        previousSchool: data.previousSchool,
      },
    });

    return {
      success: true,
      error: false,
      message: "Admission created successfully!",
      admission,
    };
  } catch (error) {
    console.error("Error creating admission:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: true,
        message: "Admission number already exists",
      };
    }

    return {
      success: false,
      error: true,
      message: "An error occurred while creating the admission",
    };
  }
};

export const updateAdmission = async (
  currentState: CurrentState,
  data: AdmissionSchema
) => {
  try {
    const updatedAdmission = await prisma.admission.update({
      where: { id: data.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        address: data.address,
        parentContact: data.parentContact,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        admissionDate: data.admissionDate || new Date(),
        previousSchool: data.previousSchool,
      },
    });

    return {
      success: true,
      error: false,
      message: "Admission updated successfully!",
      updatedAdmission,
    };
  } catch (error) {
    console.error("Error updating admission:", error);
    return {
      success: false,
      error: true,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const deleteAdmission = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.admission.delete({ where: { id: parseInt(id) } });
    return {
      success: true,
      error: false,
      message: "Admission deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting admission:", error);
    return {
      success: false,
      error: true,
      message: "Failed to delete admission",
    };
  }
};

export const createEnrollment = async (data: EnrollmentSchema) => {
  try {
    // Fetch the current academic year and term from settings
    const settings = await prisma.settings.findUnique({ where: { id: 1 } });

    if (!settings) {
      return {
        success: false,
        error: true,
        message: "Academic year and term settings not found",
      };
    }

    // Fetch admission ID using admissionNumber
    const admission = await prisma.admission.findUnique({
      where: { id: data.admissionId },
    });

    if (!admission) {
      return {
        success: false,
        error: true,
        message: "Student admission details not found",
      };
    }

    // Fetch the class to check the current number of enrollments
    const classDetails = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { enrollments: true }, // Include enrollments to get count
    });

    if (!classDetails) {
      return {
        success: false,
        error: true,
        message: "Class not found",
      };
    }

    // Check if the class capacity is reached
    if (classDetails.enrollments.length >= classDetails.capacity) {
      return {
        success: false,
        error: true,
        message: `Class ${classDetails.name} is full!`,
      };
    }

    // Create the enrollment if the capacity is not reached
    const enrollment = await prisma.enrollment.create({
      data: {
        admissionId: admission.id,
        classId: data.classId,
        gradeId: data.gradeId,
        academicYear: settings.academicYear,
        term: settings.term,
        status: data.status,
      },
    });

    // Send a notification to the admin (This can be an email or system notification)
    // For now, you could log the notification or integrate an email notification system.
    console.log(`Admin notified: Class ${classDetails.name} is full.`);

    return {
      success: true,
      error: false,
      message: "Enrollment created successfully!",
      enrollment,
    };
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return {
      success: false,
      error: true,
      message: "An error occurred while creating the enrollment",
    };
  }
};

export const updateEnrollment = async (data: EnrollmentSchema) => {
  if (!data.id)
    return { success: false, error: true, message: "Invalid Enrollment ID" };

  try {
    await prisma.enrollment.update({
      where: { id: data.id },
      data: {
        classId: data.classId,
        gradeId: data.gradeId,
        academicYear: data.academicYear,
        term: data.term,
        status: data.status,
      },
    });

    return {
      success: true,
      error: false,
      message: "Enrollment updated successfully!",
    };
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return {
      success: false,
      error: true,
      message: "Failed to update enrollment",
    };
  }
};

export const deleteEnrollment = async (id: number) => {
  try {
    await prisma.enrollment.delete({ where: { id } });
    return {
      success: true,
      error: false,
      message: "Enrollment deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return {
      success: false,
      error: true,
      message: "Failed to delete enrollment",
    };
  }
};

export const createPayroll = async (
  currentState: CurrentState,
  data: PayrollSchema) => {
  try {
    // Validate and coerce the data so that it's a plain object with the right types.
    const validatedData = payrollSchema.parse(data);

    const createdPayroll = await prisma.payroll.create({
      data: {
        employeeId: validatedData.employeeId,
        salary: validatedData.salary,
        bonus: validatedData.bonus,
        deductions: validatedData.deductions,
        payDate: validatedData.payDate,
      },
    });

    console.log("Created Payroll: ", createdPayroll);
    return {
      success: true,
      data: createdPayroll,
      message: "Payroll created successfully!",
    };
  } catch (error) {
    console.error("Error creating payroll:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        message: "There was an issue with the database operation",
      };
    }
    return {
      success: false,
      message: "An error occurred while creating the payroll record",
    };
  }
};


export const updatePayroll = async (
  data: PayrollSchema,
  currentState: CurrentState
) => {
  try {
    // Validate the data (if not already validated)
    const validatedData = payrollSchema.parse(data);

    // Create the payroll record in the database
    const createdPayroll = await prisma.payroll.create({
      data: {
        employeeId: validatedData.employeeId,
        salary: validatedData.salary,
        bonus: validatedData.bonus,
        deductions: validatedData.deductions,
        payDate: validatedData.payDate,
      },
    });

    console.log("Created Payroll: ", createdPayroll);
    return {
      success: true,
      data: createdPayroll,
      message: "Payroll created successfully!",
    };
  } catch (error) {
    console.error("Error creating payroll:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors, e.g., unique constraints if any
      return {
        success: false,
        message: "There was an issue with the database operation",
      };
    }

    return {
      success: false,
      message: "An error occurred while creating the payroll record",
    };
  }
};



export const getPayrollsByEmployee = async (employeeId: string) => {
  return await prisma.payroll.findMany({
    where: { employeeId },
    orderBy: { payDate: "desc" },
  });
};