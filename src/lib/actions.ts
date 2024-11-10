"use server";

// import { revalidatePath } from "next/cache";
import { SubjectSchema } from "./formValidationSchema";
import prisma from "./prisma";

type currentState = { success: boolean; error: boolean };
  
export const createSubject = async (
  currentState: currentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
      },
    });

    // revalidatePath("/list/subject");
    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    return { success: false, error: true };
  }
};
