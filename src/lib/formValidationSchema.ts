import { z } from "zod";
import prisma from "./prisma";

export const subjectSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(3, {
      message: "Subject name must be at least 3 characters long",
    }),
    grades: z.array(z.string()).optional(), // Array of grade IDs
    classes: z.array(z.string()).optional(), // Array of class IDs
  })
  .refine(
    (data) => (data.grades?.length || 0) > 0 || (data.classes?.length || 0) > 0,
    {
      message: "At least one grade or one class must be selected",
      path: ["grades", "classes"], // Applies the error message to both fields
    }
  );

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, {
    message: "Class name must be at least 5 characters long and is required",
  }),
  capacity: z.coerce.number().min(1, { message: "Capacity size is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const gradeSchema = z.object({
  id: z.coerce.number().optional(),
  level: z.coerce.number().min(1, { message: "Capacity size is required!" }),
});

export type GradeSchema = z.infer<typeof gradeSchema>;


export const employeeSchema = z.object({
  id: z.string().optional(),
  employeeId: z
    .string()
    .regex(/^STAFF\d{3,}$/, { message: "Invalid employee Id format!" })
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must not be more than 20 characters long" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/\d/, "Password must include at least one number")
    .regex(/[!@#$%^&*]/, "Password must include at least one special character")
    .optional()
    .or(z.literal("")),
  firstName: z.string().min(3, { message: "First name is required" }),
  lastName: z.string().min(3, { message: "Last name is required" }),
  middleName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number should be 10 digits!" })
    .max(10, { message: "Phone number should be 10 digits" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters!" }),
  img: z
    .string()
    .url("Image must be a valid URL")
    .nonempty("Image is required"),
  jobTitle: z.string().min(3, { message: "Job title is required!" }),
  hireDate: z.coerce.date({
    errorMap: () => ({ message: "Hire date is required" }),
  }),
  contractType: z.enum(["FullTime", "PartTime", "Temporary", "Contract"]),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  birthday: z.coerce.date({
    errorMap: () => ({ message: "Birthday is required" }),
  }),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;

export const admissionSchema = z.object({
  id: z.coerce.number().optional(),
  admissionNumber: z
    .string()
    .regex(/^TEPA\d{3,}$/, { message: "Invalid admission number format!" })
    .optional(), // Will be generated
  firstName: z.string().min(3, { message: "First name is required!" }),
  lastName: z.string().min(3, { message: "Last name is required!" }),
  middleName: z.string().optional(),
  address: z.string().min(3, { message: "Address is required!" }),
  parentContact: z
    .string()
    .min(10, { message: "Phone number should be 10 digits!" })
    .max(10, { message: "Phone number should be 10 digits" }),
  img: z.string().url("Image is required").nonempty("Image is required"),
  bloodType: z.string(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  birthday: z.coerce.date({ message: "Valid birthday is required!" }),
  admissionDate: z.coerce.date().optional(), // Default to now()
  previousSchool: z.string().optional(),
});

export type AdmissionSchema = z.infer<typeof admissionSchema>;

export const enrollmentSchema = z.object({
  id: z.coerce.number().optional(),
  admissionId: z.coerce
    .number()
    .min(1, { message: "Admission ID is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  academicYear: z.string().regex(/^\d{4}\/\d{4}$/, {
    message: "Invalid academic year format (e.g., 2024/2025)",
  }),
  term: z.enum(["First", "Second", "Third"], {
    message: "Valid term is required!",
  }),
  status: z.enum(["Active", "Completed", "Dropped"], {
    message: "Valid status is required!",
  }),
});

export type EnrollmentSchema = z.infer<typeof enrollmentSchema>;

export const academicHistorySchema = z.object({
  id: z.coerce.number().optional(),
  admissionId: z.number().min(1, { message: "Admission ID is required!" }),
  year: z.string().regex(/^\d{4}\/\d{4}$/, {
    message: "Invalid year format (e.g., 2024/2025)",
  }),
  term: z.enum(["First", "Second", "Third"], {
    message: "Valid term is required!",
  }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  remarks: z.string().optional(),
});

export type AcademicHistorySchema = z.infer<typeof academicHistorySchema>;

export const attendanceSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string().min(1, { message: "Employee ID is required" }),
  date: z.coerce.date({ message: "Date is required" }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
  signInTime: z.coerce.date(),
  signOutTime: z.coerce.date().nullable(),
  status: z.enum(["Present", "Absent"], {
    message: "Status must be either 'PRESENT' or 'ABSENT'",
  }),
  qrCode: z.string().min(1, { message: "QR Code is required" }),
  expiresAt: z.coerce.date({ message: "Expiration time is required" }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;


// Function to calculate grade based on the score
const calculateGrade = (score: number): string => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  return "F";
};

// Result schema for bulk entry of multiple results at once

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  enrollmentId: z.coerce
    .number()
    .min(1, { message: "Enrollment ID is required!" }),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, {
      message: "Invalid academic year format (e.g., 2024/2025)",
    }),
  term: z.enum(["First", "Second", "Third"], {
    message: "Valid term is required!",
  }),
  results: z
    .array(
      z.object({
        subjectId: z.coerce
          .number()
          .min(1, { message: "Subject ID is required!" }),
        score: z.coerce
          .number()
          .min(0, { message: "Score must be at least 0!" })
          .max(100, { message: "Score must not exceed 100!" }),
      })
    )
    .nonempty({ message: "At least one result must be provided!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const payrollSchema = z.object({
  id: z.coerce.number().optional(),
  employeeId: z.string(),
  salary: z.coerce.number().positive({ message: "Salary must be a positive number" }),
  bonus: z.coerce.number().optional(),
  deductions: z.coerce.number().optional(),
  payDate: z.coerce.date({ message: "Valid payDate is required!" }),

});

export type PayrollSchema = z.infer<typeof payrollSchema>;
