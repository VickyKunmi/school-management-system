"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  presencelogSchema,
  PresencelogSchema,
} from "@/lib/formValidationSchema";
import { createPresencelog, updatePresencelog} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


type Lesson = {
  lessonId: number;
  name: string;
  students: [];
};

const PresencelogForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PresencelogSchema>({
    resolver: zodResolver(presencelogSchema),
    defaultValues: {
      // date: data?.date,
      date: data?.date.toISOString().split("T")[0] || "",
      lessonId: data?.lessonId || "",
      studentId: data?.studentId || "",
      status: data?.status || "",
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createPresencelog : updatePresencelog,
    {
      success: false,
      error: false,
    }
  );

  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<
    string | number | undefined
  >(data?.studentId);

  // const onSubmit = handleSubmit((data) => {
  //   console.log("clicked submit")
  //   console.log("data: ", data);
  //   formAction(data);
  // });


  const onSubmit = handleSubmit((formData) => {
    if (!formData.studentId) {
      // Default to the current studentId if not selected
      formData.studentId = data?.studentId;
    }

    console.log("Submitting data: ", formData);
    formAction(formData);
  });


  
    
  

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Presence Log has been ${type === "create" ? "created" : "updated"}`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons, studentsByLesson } = relatedData;

  useEffect(() => {
    if (selectedLesson !== null) {
      const students =
        studentsByLesson.find(
          (lesson: Lesson) => lesson.lessonId === selectedLesson
        )?.students || [];
      setFilteredStudents(students);

      // Pre-select the student if updating
      if (data && selectedLesson === data.lessonId) {
        setValue("studentId", data.studentId);
      }
    }
  }, [selectedLesson, studentsByLesson, data, setValue]);

  useEffect(() => {
    // If the data already has a studentId, and the selectedLesson matches,
    // update the selected student to display the default value
    if (data && data.studentId) {
      setSelectedStudent(data.studentId);
    }
  }, [data]);



  useEffect(() => {
    console.log("Form Data:", data);
  }, [data]);
  
  // console.log(relatedData, "Rela");

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new presence log"
          : "update the presence log"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="date"
          name="date"
          defaultValue={data?.date.toISOString().split("T")[0]}
          register={register}
          error={errors?.date}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-sm text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
            onChange={(e) => setSelectedLesson(Number(e.target.value))}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {" "}
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>

        {/* Display the selected student's name outside the select tag */}

        {/* {selectedLesson !== null && ( */}
          <div>
            <label
              htmlFor="students"
              className="block text-sm font-medium text-gray-700"
            >
              Students
            </label>
            <select
              id="students"
              {...register("studentId")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              defaultValue={data?.studentId || ""} 
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select a student</option>
              {filteredStudents.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {`${student.firstName} ${student.lastName}`}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>
        {/* )} */}

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            defaultValue={data?.status || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Select status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default PresencelogForm;
