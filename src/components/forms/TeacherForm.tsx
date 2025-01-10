"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const initialState = {
  message: "",
  success: false,
  error: false,
};

const TeacherForm = ({
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
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: data || {},

    
  });
  

  const [img, setImg] = useState<any>(data?.img || null);
  const [showPassword, setShowPassword] = useState(false);
  // const [img, setImg] = useState<CloudinaryUploadWidgetInfo | null>(null);
  const isUpdateForm = type === "create" || !data?.img;
  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    initialState
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Data: ", data);
    // formAction({ ...data, img: img.secure_url || data.img  });
    formAction({
      ...data,
      img: img.secure_url || data.img,
      subjects: getValues("subjects") || data.subjects,
    });
  });

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    const currentValues = getValues("subjects") || [];
    const uniqueValues = Array.from(
      new Set([...currentValues, ...selectedOptions])
    );
    setValue("subjects", uniqueValues, { shouldValidate: true });
  };

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData;

  useEffect(() => {
    if (data?.subjects) {
      const subjectIds = data.subjects.map((subject: { id: number }) =>
        subject.id.toString()
      );
      setValue("subjects", subjectIds, { shouldValidate: true });
    }
  }, [data, setValue]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update the teacher"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        {/* <div className='relative justify-between flex-wrap gap-2'> */}
        <InputField
          label="Password"
          name="password"
          // type="password"
          type={showPassword ? "text" : "password"}
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
          rightIcon={
            <div onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" size={20} />
              ) : (
                <FaEye className="text-gray-500" size={20} />
              )}
            </div>
          }
        />
        {/* </div> */}

        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.lastName}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <CldUploadWidget
          uploadPreset="schoolManagementSystem"
          onSuccess={(result, { widget }) => {
            if (result.info && typeof result.info !== "string") {
              setImg(result.info);
              setValue("img", result.info.secure_url, { shouldValidate: true });
              widget.close();
            } else {
              toast.error("Image upload failed or returned unexpected data.");
            }
          }}
        >
          {({ open }) => {
            return (
              <div>
                <div
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/upload.png" alt="" width={28} height={28} />
                  <span>Upload a photo</span>
                </div>

                <div>
                  {img ? (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected Image: {img.original_filename} ||{" "}
                      {img.secure_url ? (
                        <a
                          href={img.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Image
                        </a>
                      ) : (
                        "URL not available"
                      )}
                    </p>
                  ) : data?.img ? (
                    <p className="text-sm text-gray-600 mt-2">
                      Existing Image:{" "}
                      <a
                        href={data.img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Image
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2">
                      No image selected.
                    </p>
                  )}
                </div>
              </div>
            );
          }}
        </CldUploadWidget>

        

        <div className="flex flex-col gap-4 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjects")}
            defaultValue={
              data?.subjects?.map((subject: { id: number }) =>
                subject.id.toString()
              ) || []
            }
            onChange={handleSubjectChange}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          {/* Display the selected subjects with 'X' to remove */}
          <div className="flex flex-wrap gap-2 mt-2">
            {(getValues("subjects") || []).map((subjectId: string) => {
              const subject = subjects.find(
                (sub: { id: number }) => sub.id.toString() === subjectId
              );

              // Ensure that each "X" button only appears for valid selected subjects
              return subject ? (
                <span
                  key={subjectId}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-md flex items-center gap-2"
                >
                  {subject.name}
                  <button
                    type="button"
                    onClick={() => {
                      const currentValues = getValues("subjects") || [];
                      const updatedValues = currentValues.filter(
                        (id: string) => id !== subjectId
                      );
                      setValue("subjects", updatedValues, {
                        shouldValidate: true,
                      });
                    }}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ) : null;
            })}
          </div>

          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">
          <p>{state.message}</p>
        </span>
      )}

      <button className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default TeacherForm;
