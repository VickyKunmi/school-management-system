"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createParent, updateParent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { CldUploadWidget } from "next-cloudinary";

const initialState = {
  message: "",
  success: false,
  error: false,
};

const ParentForm = ({
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
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const [img, setImg] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    initialState
  );

  const onSubmit = handleSubmit((data) => {
    formAction({
      ...data,
      img: img.secure_url,
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router, type, setOpen]);

  const { students } = relatedData;

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students || []);
  const [selectedStudent, setSelectedStudent] = useState<number[]>(
    data?.studentIds || []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredStudents(
        students.filter(
          (student: { firstName: string; lastName: string }) =>
            student.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleSelectStudent = (student: {
    id: number;
    firstName: string;
    lastName: string;
  }) => {
    const isSelected = selectedStudent.includes(student.id);
    const updatedStudents = isSelected
      ? selectedStudent.filter((id) => id !== student.id)
      : [...selectedStudent, student.id];

    setSelectedStudent(updatedStudents);
    setValue("studentId", updatedStudents.map(String), {
      shouldValidate: true,
    }); // Convert to string[]
  };

  useEffect(() => {
    // Convert selectedStudent to string[] before setting the form value
    setValue("studentId", selectedStudent.map(String), {
      shouldValidate: true,
    });
  }, [selectedStudent, setValue]);

  const selectedStudentsDisplay = selectedStudent
    .map((id) => {
      const student = students.find((s: { id: number }) => s.id === id);
      return student ? `${student.firstName} ${student.lastName}` : "";
    })
    .join(", ");

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new parent" : "Update the parent"}
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
          <label className="text-xs text-gray-500">Search for Student(s)</label>
          <input
            type="text"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name"
          />
          <div className="mt-2 text-sm text-gray-500">
            Selected: {selectedStudentsDisplay || "None"}
          </div>
          {searchTerm && filteredStudents.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
              {filteredStudents.map(
                (student: {
                  id: number;
                  firstName: string;
                  lastName: string;
                }) => (
                  <li
                    key={student.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-200 ${
                      selectedStudent.includes(student.id) ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleSelectStudent(student)}
                  >
                    {student.firstName} {student.lastName}
                  </li>
                )
              )}
            </ul>
          )}
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">{errors.studentId.message}</p>
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

export default ParentForm;
