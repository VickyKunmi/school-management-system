"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { announcementSchema, AnnouncementSchema } from "@/lib/formValidationSchema";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const AnnouncementForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?:any;

}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  const [state, formAction] = useFormState(
      type === "create" ? createAnnouncement : updateAnnouncement,
      {
        success: false,
        error: false,
      }
    );



  const onSubmit = handleSubmit((data) => {
    formAction(data)
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Announcement has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen]);


  const { classes } = relatedData;





  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new announcement" : "update the announcement"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />

        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={
            data?.date ? new Date(data?.date).toISOString().split("T")[0] : ""
          }
          register={register}
          error={errors?.date}
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

        <div>
          <label className="text-sm text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            <option value="">Select a class</option>
            {classes.map((classNames: { id: number; name: string }) => (
              <option value={classNames.id} key={classNames.id}>
                {classNames.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}{" "}
      </button>
    </form>
  );
};

export default AnnouncementForm;
