import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, {
    message: "Subject name must be at least 5 characters long and is required",
  }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, {
    message: "Class name must be at least 5 characters long and is required",
  }),
  capacity: z.coerce.number().min(1, { message: "Capacity size is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 5 characters long" })
    .max(20, { message: "Username must not be more than 20 characters long" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must include at least one special character"
    )
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(3, { message: "First name is required" }),
  lastName: z.string().min(3, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number should be 10 digits!" })
    .max(10, { message: "Phone number should be 10 digits" }),

  address: z.string().min(3, { message: "At least 3 charcters long!" }),

  img: z.string().url("Image is required").nonempty("Image is required"),

  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 5 characters long" })
    .max(20, { message: "Username must not be more than 20 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password ahould be at least 8 character long" })
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(3, { message: "First name is required" }),
  lastName: z.string().min(3, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number should be 10 digits!" })
    .max(10, { message: "Phone number should be 10 digits" }),

  address: z.string().min(3, { message: "At least 3 charcters long!" }),

  img: z.string(),

  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must not be more than 20 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password ahould be at least 8 character long" })
    .optional()
    .or(z.literal("")),
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters long" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z
    .string()
    .min(10, { message: "Phone number should be 10 digits" })
    .max(10, { message: "Phone number should be 10 digits" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters long" }),
  img: z.string().url({ message: "Image must be a valid URL" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  // studentId: z.string().min(1, {message: "Student Id is required!"}),
  studentId: z
    .array(z.string()) // Changed from string to array of strings
    .min(1, { message: "At least one student ID is required!" }),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const attendanceSchema = z.object({
  id: z.string().optional(),
  teacherId: z.string().min(1, { message: "Teacher ID is required" }),
  date: z.coerce.date({ message: "Date is required" }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
  signInTime: z.coerce.date(),
  signOutTime: z.coerce.date().nullable(),
  status: z
    .enum(["Present", "Absent"], {
      message: "Status must be either 'PRESENT' or 'ABSENT'",
    }),
  qrCode: z.string().min(1, { message: "QR Code is required" }),
  expiresAt: z.coerce.date({ message: "Expiration time is required" }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;


export const lessonSchema = z.object({
  id: z.coerce.number().optional(), 
  name: z.string().min(2, { message: "Lesson name must be at least 2 characters long" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
    message: "Day must be a valid weekday",
  }),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: "Start time must be in HH:mm format",
  }),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, {
    message: "End time must be in HH:mm format",
  }),
  
  subjectId: z.coerce.number().min(1, { message: "Subject ID is required and must be valid" }),
  classId: z.coerce.number().min(1, { message: "Class ID is required and must be valid" }),
  teacherId: z.string().min(1, { message: "Teacher ID is required and must be valid" }),
  exams: z.array(z.string()).optional(), 
  assignments: z.array(z.string()).optional(), 
  attendance: z.array(z.string()).optional(),
})
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be earlier than end time",
    path: ["startTime"], 
  });

export type LessonSchema = z.infer<typeof lessonSchema>;



export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;




export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startDate: z.coerce.date({ message: "Start time is required!" }),
  dueDate: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;



export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number().min(0, { message: "Score cannot be less than 0." }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.string().min(1, { message: "Student ID is required!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;