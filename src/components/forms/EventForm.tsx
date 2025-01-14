"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { EventSchema, eventSchema } from "@/lib/formValidationSchema";
import { createEvent, updateEvent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const EventForm = ({
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
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    // defaultValues: formattedData,
  });

  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  // console.log("Formatted Data:", formattedData);

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen]);

  const { classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new event" : "update the event"}
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
          // defaultValue={data?.date}
          defaultValue={
            data?.date ? new Date(data?.date).toISOString().split("T")[0] : ""
          }
          register={register}
          error={errors?.date}
        />

        <InputField
          label="Start Time (Africa/Accra time zone)"
          name="startTime"
          type="time"
          defaultValue={data?.startTime ? new Date(data?.startTime).toISOString().split('T')[1].slice(0, 5) : ''}// Ensure it's an empty string if undefined
          register={register}
          error={errors?.startTime}
        />

        <InputField
          label="End Time (Africa/Accra time zone)"
          name="endTime"
          type="time"
          defaultValue={data?.endTime ? new Date(data?.endTime).toISOString().split('T')[1].slice(0, 5) : ''}
          register={register}
          error={errors?.endTime}
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

export default EventForm;
