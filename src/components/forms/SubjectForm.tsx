"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  name: z
    .string()
    .min(5, { message: "Subject name must be at least 5 characters long" })
    .max(20, {
      message: "Subject name must not be more than 20 characters long",
    }),
  teachers: z.string().min(3, { message: "At least 3 charcters long!" }),
  lessons: z.string().min(3, { message: "At least 3 charcters long!" }),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log("create");
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new Subject</h1>
      {/* <span className="text-xs text-gray-400 font-medium">
        Authentication Info
      </span> */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson"
          name="lesson"
          type="lesson"
          defaultValue={data?.lessons}
          register={register}
          error={errors?.lessons}
        />
      </div>

      {/* <span className="text-xs text-gray-400 font-medium">Personal Info</span> */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Teacher"
          name="teacher"
          // type="email"
          defaultValue={data?.teachers}
          register={register}
          error={errors?.teachers}
        />
      </div>

      <button className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}{" "}
      </button>
    </form>
  );
};

export default SubjectForm;
