import { z } from "zod";

export const subjectSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Subject name must be at least 5 characters long and is required" })
    
  });

export type SubjectSchema = z.infer<typeof subjectSchema>;
