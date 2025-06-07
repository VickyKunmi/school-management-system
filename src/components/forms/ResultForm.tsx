import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { useFormState } from "react-dom";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchema";
import { createResult, getSettings, updateResult } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update" | "view";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const defaultResults =
    relatedData?.subjects && relatedData.subjects.length > 0
      ? relatedData.subjects.map((subject: { id: number; name: string }) => ({
          subjectId: subject.id,
          score:
            data?.results?.find(
              (r: { subjectId: number }) => r.subjectId === subject.id
            )?.score ?? 0,
        }))
      : data?.results || [];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      // enrollmentId: data?.enrollmemtId,
      enrollmentId: data?.enrollmentId || data?.id,
      academicYear: data?.academicYear || "",
      term: data?.term || "",
      results: defaultResults,
    },
  });

  // useFieldArray to manage the results array
  const { fields } = useFieldArray({
    name: "results",
    control,
  });

  const [academicYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  console.log("related Data:", relatedData);

  const calculateGrade = (score: number): string => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B+";
    if (score >= 60) return "B";
    if (score >= 50) return "C+";
    if (score >= 40) return "C";
    return "F";
  };

  const onSubmit = handleSubmit((data) => {
    console.log("Final Data to Submit:", data);
    formAction(data);
  });

  // console.log("Final Data to Submit:", data);

  const router = useRouter();



  const subjects =
  relatedData?.subjects ??
  (data?.results
    ? data.results.map((result: any) => result.subject)
    : []);


  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  useEffect(() => {
    // Fetch the current academic year and term
    const fetchSettings = async () => {
      const settings = await getSettings();
      if (settings) {
        setAcademicYear(settings.academicYear);
        setTerm(settings.term);

        // Set default values in form fields
        setValue("academicYear", settings.academicYear);
        setValue("term", settings.term);
      }
    };

    fetchSettings();
  }, [setValue]);

  console.log("Existing Results in Data:", data?.results);

  console.log("Subjects from relatedData:", relatedData?.subjects);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>

      {/* Display Subject Table */}
      <div className="overflow-x-auto">
        <InputField
          label="enrollment Id"
          name="enrollmentId"
          defaultValue={data?.enrollmentId}
          register={register}
          error={errors?.enrollmentId}
          // hidden
        />

        <InputField
          label="Academic Year"
          name="academicYear"
          defaultValue={data?.academicYear}
          register={register}
          error={errors?.academicYear}
          // hidden
        />

        <InputField
          label="Term"
          name="term"
          defaultValue={data?.term}
          register={register}
          error={errors?.term}
          // hidden
        />

        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {fields.length > 0 ? (
              fields.map((field, index) => {
                // Find the subject name by subjectId

                const subjectInfo = subjects.find(
                  (subject: { id: number; name: string }) =>
                    subject.id === field.subjectId
                );

                // Debugging to check the subject and field values
                console.log("Field subjectId:", field.subjectId);
                console.log("Subject Info:", subjectInfo);

                // Watch the score for each field
                const watchedScore = watch(
                  `results.${index}.score`,
                  field.score
                );

                return (
                  <tr key={field.id}>
                    <td className="px-4 py-2">
                      {subjectInfo ? subjectInfo.name : "Unknown Subject"}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        {...register(`results.${index}.score`, {
                          required: "Score is required!",
                          valueAsNumber: true,
                        })}
                        className="ring-1 ring-gray-300 p-2 rounded-md"
                      />
                      {errors.results && errors.results[index]?.score && (
                        <p className="text-xs text-red-400">
                          {errors.results[index]?.score?.message}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <p>{calculateGrade(watchedScore)}</p>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
      </div>

      {/* Submit Button */}
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
