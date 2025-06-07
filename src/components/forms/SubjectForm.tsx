"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchema";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      grades: data?.grades?.map((grade: { id: number }) => String(grade.id)) || [],
      classes: data?.classes?.map((cls: { id: number }) => String(cls.id)) || [],
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );
  console.log("Form state:", state);
  console.log("log when updating: ", data);

  // const onSubmit = handleSubmit((data) => {
  //   console.log("create: ", data);
  //   formAction(data);
  // });


  const onSubmit = handleSubmit((formData) => {
    // Transform grades: if they're objects, extract their id; if they're strings, leave as-is.
    const transformedData = {
      ...formData,
      id: Number(formData.id), // Ensure id is a number
      grades: Array.isArray(formData.grades)
        ? formData.grades.map((g: any) => (typeof g === "object" ? String(g.id) : g))
        : [],
      classes: Array.isArray(formData.classes)
        ? formData.classes.map((c: any) => (typeof c === "object" ? String(c.id) : c))
        : [],
    };
  
    console.log("Transformed data before update:", transformedData);
    formAction(transformedData);
  });

  


  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen]);

  const { classes, allgrade } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "update the subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
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

        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-sm text-gray-500">
            Grade (hold the ctrl key to select multiple)
          </label>
          <select
            multiple
            style={{ cursor: "pointer" }}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("grades")}
            defaultValue={
              data?.grades?.map((grade: { id: number }) => String(grade.id)) ||
              []
            }
          >
            {allgrade?.map((grade: { id: number; level: number }) => (
              <option key={grade.id} value={String(grade.id)}>
                {grade.level}
              </option>
            ))}
          </select>

          {errors.grades?.message && (
            <p className="text-xs text-red-400">
              {errors.grades.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-sm text-gray-500">
            Class (hold the ctrl key to select multiple)
          </label>
          <select
            multiple
            style={{ cursor: "pointer" }}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classes")}
            defaultValue={
              data?.classes?.map((cls: { id: number }) => String(cls.id)) || []
            }
          >
            {classes?.map((cls: { id: number; name: string }) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {errors.classes?.message && (
            <p className="text-xs text-red-400">
              {/* {errors.classs.message.toString()} */}
              {errors.classes && (
                <p className="text-xs text-red-400">{errors.classes.message}</p>
              )}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">
          {state.error && (
            <div className="text-red-500 text-sm">
              <p>{state.message}</p>
            </div>
          )}
        </span>
      )}
      <button className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;
