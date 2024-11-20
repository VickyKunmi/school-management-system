import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(2, {
      message:
        "Subject name must be at least 5 characters long and is required",
    }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, {message: "Class name must be at least 5 characters long and is required"}),
  capacity: z.coerce.number().min(1, { message: "Capacity size is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;



export const teacherSchema = z.object({
  id:z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 5 characters long" })
    .max(20, { message: "Username must not be more than 20 characters long" }),
    password: z
    .string()
    .min(8, { message: "Password ahould be at least 8 character long" }),
    firstName: z.string().min(3, { message: "First name is required" }),
    lastName: z.string().min(3, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
    .string()
    .min(10, { message: "Phone number should be 10 digits!" })
    .max(10, { message: "Phone number should be 10 digits" }),
    // phone: z.string().optional(),
  address: z.string().min(3, { message: "At least 3 charcters long!" }),
  // img: z.string(),
  img: z.string().url({ message: "Invalid image URL" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  subjects: z.array(z.string()).optional(), // subject ids
  
});


export type TeacherSchema = z.infer<typeof teacherSchema>;