"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AdmissionSchema, admissionSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createAdmission, updateAdmission } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const initialState = {
  message: "",
  success: false,
  error: false,
};

const AdmissionForm = ({
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
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AdmissionSchema>({
    resolver: zodResolver(admissionSchema),
  });

  // const [img, setImg] = useState<any>(data?.img || null);
  const [img, setImg] = useState<any>(
    data?.img ? { secure_url: data.img } : null
  );

  const [state, formAction] = useFormState(
    type === "create" ? createAdmission : updateAdmission,
    initialState
  );

  const onSubmit = handleSubmit((data) => {
    console.log("data: ", data);
    formAction({ ...data, img: img.secure_url || data.img });
    
  });

  
  const router = useRouter();

 

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "Admitted" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error(state.message || "Something went wrong!");
    }
  }, [state, router, type, setOpen]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (img?.secure_url) {
      setValue("img", img.secure_url, { shouldValidate: true });
    }
  }, [img, setValue]);
  

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Admit a new student" : "Update student details"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Admission Number"
            name="admissionNumber"
            defaultValue={data?.admissionNumber}
            register={register}
            error={errors?.admissionNumber}
            hidden
          />
        )}

        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors?.firstName}
        />

        <InputField
          label="Middle Name (Optional)"
          name="middleName"
          defaultValue={data?.middleName}
          register={register}
          error={errors?.middleName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.lastName}
          register={register}
          error={errors?.lastName}
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
        <InputField
          label="Parent Contact"
          name="parentContact"
          defaultValue={data?.parentContact}
          register={register}
          error={errors?.parentContact}
        />

        <InputField
          label="Previous School (Optional)"
          name="previousSchool"
          defaultValue={data?.previousSchool}
          register={register}
          error={errors?.previousSchool}
        />
        <InputField
          label="Admission Date"
          name="admissionDate"
          defaultValue={data?.admissionDate.toISOString().split("T")[0]}
          register={register}
          error={errors.admissionDate}
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
                {/* <div>
                  {img ? (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected Image:{" "}
                      {img.original_filename || "Existing Image"} ||{" "}
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
                </div> */}
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

export default AdmissionForm;
