"use server";
import { Prisma } from "@prisma/client";
import {
  SubjectSchema,
  ClassSchema,
  TeacherSchema,
  StudentSchema,
  ParentSchema,
  AttendanceSchema,
} from "./formValidationSchema";
import prisma from "./prisma";
import {clerkClient, auth } from "@clerk/nextjs/server";


type CurrentState = { success: boolean; error: boolean; message?: string };



export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
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
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
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

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
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


export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  let userId: string | null = null;

  try {
    // Await the clerkClient to get the actual Clerk client instance
    const client = await clerkClient(); // Ensure that you await clerkClient()

    // Create the user in Clerk and retrieve the generated ID
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: "teacher" },
    });

    userId = user.id; // Save the Clerk-generated ID

    // Create the Teacher record in Prisma using Clerk's user ID
    await prisma.teacher.create({
      data: {
        id: userId, // Use the Clerk-generated ID
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return {
      success: true,
      error: false,
      message: "Teacher Created Successfully!",
    };
  } catch (error) {
    console.error("Error occurred:", error);

    // Rollback the Clerk user if Prisma operation fails
    if (userId) {
      try {
        const client = await clerkClient(); // Await the client again for rollback
        await client.users.deleteUser(userId); // Delete the Clerk user
      } catch (rollbackError) {
        console.error("Failed to rollback Clerk user:", rollbackError);
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0]; // Get the first error
        console.log("Clerk Error:", clerkError);

        // Handle 'form_identifier_exists' error code from Clerk
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

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0]; // First field that caused the violation
          const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
          return { success: false, error: true, message: message };
        }
      } else {
        console.error("Prisma Known Error: ", error.message);
        return {
          success: false,
          error: true,
          message: "There was an issue with the database operation",
        };
      }
    }

    return {
      success: false,
      error: true,
      message: "An error occurred while creating!",
    };
  }
};


export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return {
      success: true,
      error: false,
      message: "Student updated successfully!",
    };
  } catch (error) {
    console.log(error);
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0]; // Get the first error
        console.log("Clerk Error:", clerkError);

        // Handle 'form_identifier_exists' error code from Clerk
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
        // Check if error.meta exists and is of type object with 'target' array
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0]; // First field that caused the violation
          const message = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`;
          return { success: false, error: true, message: message };
        }
      } else {
        // Handle other specific Prisma errors
        console.error("Prisma Known Error: ", error.message);
        return {
          success: false,
          error: true,
          message: "There was an issue with the database operation",
        };
      }
    }
    return {
      success: false,
      error: true,
      message: "Unable to update teacher!",
    };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  let userId: string | null = null;

  try {
    // Check if class has reached capacity
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return {
        success: false,
        error: true,
        message: "Class has reached its capacity",
      };
    }

    // const client = clerkClient();

    // Create the user in Clerk
    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: "student" },
    });

    userId = user.id;

    // Create the student record in Prisma
    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Student created successfully",
    };
  } catch (error) {
    console.log("Error creating user: ", error);
    if (userId) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(userId); // Delete the Clerk user
      } catch (rollbackError) {
        console.error("Failed to rollback Clerk user:", rollbackError);
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0]; // Get the first error
        console.log("Clerk Error:", clerkError);

        // Handle 'form_identifier_exists' error code from Clerk
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

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Check if error.meta exists and is of type object with 'target' array
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0]; // First field that caused the violation
          const message = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`;
          return { success: false, error: true, message: message };
        }
      } else {
        // Handle other specific Prisma errors
        console.error("Prisma Known Error: ", error.message);
        return {
          success: false,
          error: true,
          message: "There was an issue with the database operation",
        };
      }
    }

    // Handle unexpected errors
    return {
      success: false,
      error: true,
      message: "An error occurred while creating the student",
    };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/teachers");
    return {
      success: true,
      error: false,
      message: "Student Updated successfully!",
    };
  } catch (error) {
    console.log(error);
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0]; // Get the first error
        console.log("Clerk Error:", clerkError);

        // Handle 'form_identifier_exists' error code from Clerk
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
        // Check if error.meta exists and is of type object with 'target' array
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0]; // First field that caused the violation
          const message = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`;
          return { success: false, error: true, message: message };
        }
      } else {
        // Handle other specific Prisma errors
        console.error("Prisma Known Error: ", error.message);
        return {
          success: false,
          error: true,
          message: "There was an issue with the database operation",
        };
      }
    }

    return { success: false, error: true, message: "Unable to update student" };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  let userId: string | null = null;

  try {
    // const client = clerkClient();

    // Create the user in Clerk
    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: { role: "parent" },
    });

    userId = user.id;

    // Create the student record in Prisma
    await prisma.parent.create({
      data: {
        id: userId,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        sex: data.sex,
        students: {
          connect: (Array.isArray(data.studentId)
            ? data.studentId
            : [data.studentId]
          ).map((id: string) => ({ id })),
        },
        
      },
    });

    return {
      success: true,
      error: false,
      message: "Parent created successfully",
    };
  } catch (error) {
    console.log("Error creating user: ", error);
    if (userId) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(userId); // Delete the Clerk user
      } catch (rollbackError) {
        console.error("Failed to rollback Clerk user:", rollbackError);
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0]; // Get the first error
        console.log("Clerk Error:", clerkError);

        // Handle 'form_identifier_exists' error code from Clerk
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

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Check if error.meta exists and is of type object with 'target' array
        const meta = error.meta;
        if (meta && Array.isArray(meta.target)) {
          const field = meta.target[0]; // First field that caused the violation
          const message = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`;
          return { success: false, error: true, message: message };
        }
      } else {
        // Handle other specific Prisma errors
        console.error("Prisma Known Error: ", error.message);
        return {
          success: false,
          error: true,
          message: "There was an issue with the database operation",
        };
      }
    }

    // Handle unexpected errors
    return {
      success: false,
      error: true,
      message: "An error occurred while creating the parent",
    };
  }
};



export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    // Await the clerkClient to get the actual Clerk client instance
    const client = await clerkClient(); 

    // Use the client to update the user
    await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Update the parent record in the database
    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        sex: data.sex,
        students: {
          connect: (Array.isArray(data.studentId)
            ? data.studentId
            : [data.studentId]
          ).map((id: string) => ({ id })),
        },
      },
    });

    return {
      success: true,
      error: false,
      message: "Student Updated successfully!",
    };
  } catch (error) {
    console.log(error);

    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkErrors = (error as any).errors;
      if (clerkErrors.length > 0) {
        const clerkError = clerkErrors[0]; // Get the first error
        console.log("Clerk Error:", clerkError);

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
          const field = meta.target[0]; // First field that caused the violation
          const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
          return { success: false, error: true, message: message };
        }
      } else {
        console.error("Prisma Known Error: ", error.message);
        return {
          success: false,
          error: true,
          message: "There was an issue with the database operation",
        };
      }
    }

    return { success: false, error: true, message: "Unable to update parent" };
  }
};





export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // First, delete all students related to this parent
    await prisma.student.deleteMany({
      where: {
        parentId: id,
      },
    });

    // Now delete the parent record
    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // Initialize Clerk client and delete the user
    const client = await clerkClient(); // This should give you the actual ClerkClient instance
    await client.users.deleteUser(id); // Ensure 'id' corresponds to the Clerk user ID

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};





export const createAttendance = async (
  data: AttendanceSchema
) => {
  try {
    const expiresAt = new Date(new Date().getTime() + 10 * 60 * 1000);

    // Check if attendance already exists for the teacher and date
    const existingAttendance = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: data.teacherId,
        date: data.date,
        signOutTime: null, // only consider records that haven't been signed out yet
      },
    });

    if (existingAttendance) {
      // If attendance exists and is not signed out yet, update the sign-in or sign-out times as needed
      // Check if sign-in is already done, then update sign-out time if needed
      if (existingAttendance.signInTime && !existingAttendance.signOutTime) {
        return updateSignOutTime(data.teacherId);
      }
      return {
        success: false,
        error: true,
        message: "Attendance already recorded for this date and teacher",
      };
    }

    // Create new attendance if no record found
    await prisma.teacherAttendance.create({
      data: {
        teacher: { 
          connect: { id: data.teacherId },
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





export const updateSignOutTime = async (teacherId: string) => {
  try {
    const currentTime = new Date();

    // Find the most recent attendance record for the teacher where signOutTime is null
    const attendance = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: teacherId,
        signOutTime: null,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    if (!attendance) {
      return {
        success: false,
        message: "No active attendance record found for signing out.",
      };
    }

    // Update the signOutTime to mark the end of the day
    await prisma.teacherAttendance.update({
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
  teacherId: string;
  timestamp: string;
  uniqueId: string;
};



export const validateQRCode = async (qrCodeData: string) => {
  try {
    const { teacherId, timestamp, uniqueId }: QRCodeData = JSON.parse(qrCodeData);

    // Verify teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { id: true, firstName: true, lastName: true, email: true, img: true },
    });

    if (!teacher) {
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
      data: teacher,
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

    let teacher;
    let attendanceData;

    // Fetch teacher details based on role
    if (role === "admin") {
      teacher = await prisma.teacher.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          img: true,
        },
      });
      // If admin, handle the case where teacher is an array
      if (!teacher || teacher.length === 0) {
        throw new Error("No teachers found");
      }
      // Admin can get a list of teachers, but we set it to the first teacher or null
      teacher = teacher.length > 0 ? teacher[0] : null;
    } else {
      // Regular user (teacher) sees only their own data
      teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          img: true,
        },
      });
      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    // Fetch attendance data based on the role
    if (role === "admin") {
      attendanceData = await prisma.teacherAttendance.findMany({
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          signInTime: true,
          signOutTime: true,
          status: true,
          teacher: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } else {
      attendanceData = await prisma.teacherAttendance.findMany({
        where: { teacherId: userId },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          signInTime: true,
          signOutTime: true,
          status: true,
          teacher: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    }

    return { teacher, attendanceData, role };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching teacher and attendance data");
  }
};

