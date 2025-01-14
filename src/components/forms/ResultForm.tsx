import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchema";
import { createResult, updateResult } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Student = {
  // id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  classId: number;
};

const ResultForm = ({
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
  const formattedData = data
    ? {
        ...data,
        examId:
          data.examId ||
          relatedData?.exams?.find(
            (exam: { title: string }) => exam.title === data.title
          )?.id ||
          "",
        assignmentId:
          data.assignmentId ||
          relatedData?.assignments?.find(
            (assignment: { title: string }) => assignment.title === data.title
          )?.id ||
          "",
        studentId: data.studentId,
      }
    : {};

  // console.log("formatted Data: ", formattedData);
  // console.log("Data: ", data);
  // console.log("relatedData: ", relatedData);

  const [selectedExamId, setSelectedExamId] = useState(data?.examId || "");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    data?.assignmentId || ""
  );

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: formattedData,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  useEffect(() => {
    if (type === "update" && data) {
      // Set the default values for examId, assignmentId, and studentId
      setSelectedExamId(data.examId || "");
      setSelectedAssignmentId(data.assignmentId || "");
      // setValue("studentId", data.studentId || "");
    }
  }, [
    type,
    data,
    setValue,
    relatedData?.studentsByExam,
    relatedData?.studentsByAssignment,
  ]);

  useEffect(() => {
    if (selectedExamId && relatedData?.studentsByExam) {
      const selectedExamStudents = relatedData.studentsByExam.find(
        (mapping: { examId: number }) =>
          mapping.examId === Number(selectedExamId)
      );
      setFilteredStudents(selectedExamStudents?.students || []);
    } else if (selectedAssignmentId && relatedData?.studentsByAssignment) {
      const selectedAssignmentStudents = relatedData.studentsByAssignment.find(
        (mapping: { assignmentId: number }) =>
          mapping.assignmentId === Number(selectedAssignmentId)
      );
      setFilteredStudents(selectedAssignmentStudents?.students || []);
    } else {
      setFilteredStudents(relatedData?.students || []); // Fallback to all students
    }
  }, [selectedExamId, selectedAssignmentId, relatedData]);

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { exams, assignments } = relatedData;
  console.log("related student: ", relatedData.students);

  const selectedStudent = filteredStudents.find(
    (student) => student.studentId === formattedData?.studentId
  );

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Score"
          name="score"
          type="number"
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
        />

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
            defaultValue={formattedData?.examId || ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedExamId(value !== "" ? Number(value) : "");
            }}
          >
            <option value="">Select an Exam</option>
            {exams?.map((exam: { id: number; title: string }) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">{errors.examId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId")}
            defaultValue={formattedData?.assignmentId || ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedAssignmentId(value !== "" ? Number(value) : "");
            }}
          >
            <option value="">Select an Assignment</option>
            {assignments?.map((assignment: { id: number; title: string }) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Student</label>
          {formattedData ? (
            <p>
              Existing Student: {formattedData.studentFirstName}{" "}
              {formattedData.studentLastName}
            </p>
          ) : (
            <p>No student selected</p>
          )}
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={formattedData?.studentId || ""}
          >
            <option value="">Select student</option>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.firstName} {student.lastName}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No student selected
              </option>
            )}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">{errors.studentId.message}</p>
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

export default ResultForm;
