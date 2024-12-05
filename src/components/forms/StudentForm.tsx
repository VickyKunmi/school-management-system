"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StudentSchema, studentSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialState = {
  message: "",
  success: false,
  error: false,
};

const StudentForm = ({
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
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    initialState
  );

  const onSubmit = handleSubmit((data) => {
    formAction({ ...data, img: img.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router, type, setOpen]);

  const { grades, classes, parents } = relatedData;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredParents, setFilteredParents] = useState(parents);
  const [selectedParent, setSelectedParent] = useState<any>(data?.parentId);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredParents(
        parents.filter(
          (parent: { firstName: string; lastName: string }) =>
            parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parent.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredParents(parents);
    }
  }, [searchTerm, parents]);

  const handleSelectParent = (parent: {
    id: number;
    firstName: string;
    lastName: string;
  }) => {
    setSelectedParent(parent.id);
    setSearchTerm(`${parent.firstName} ${parent.lastName}`);
    setValue("parentId", parent.id.toString());
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update the student"}
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
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />

        <InputField
          label="Password"
          name="password"
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
          error={errors?.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors?.lastName}
        />

        <InputField
          label="Phone No"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />

        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType}
        />

        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors?.birthday}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Parent</label>
          <input
            type="text"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for a parent"
          />
          {searchTerm && filteredParents.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
              {filteredParents.map(
                (parent: {
                  id: number;
                  firstName: string;
                  lastName: string;
                }) => (
                  <li
                    key={parent.id}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectParent(parent)}
                  >
                    {parent.firstName} {parent.lastName}
                  </li>
                )
              )}
            </ul>
          )}
          {errors.parentId?.message && (
            <p className="text-xs text-red-400">
              {errors.parentId.message.toString()}
            </p>
          )}
        </div>
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
          <label className="text-sm text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2  rounded-md text-sm w-full"
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: string }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map(
              (classItem: {
                id: number;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  ({classItem.name} -{" "}
                  {classItem._count.students + "/" + classItem.capacity}{" "}
                  Capacity )
                </option>
              )
            )}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

        <CldUploadWidget
          uploadPreset="schoolManagementSystem"
          onSuccess={(result, { widget }) => {
            console.log("result: ", result);
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
        {type === "create" ? "Create" : "Update"}{" "}
      </button>
    </form>
  );
};

export default StudentForm;
