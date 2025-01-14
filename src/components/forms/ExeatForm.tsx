// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useFormState } from "react-dom";
// import InputField from "../InputField";
// import { Dispatch, SetStateAction, useEffect } from "react";
// import { ExeatSchema, leaveSchema } from "@/lib/formValidationSchema";
// import { createExeat, updateExeat } from "@/lib/actions";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// const ExeatForm = ({
//   type,
//   data,
//   setOpen,
//   relatedData,
// }: {
//   type: "create" | "update";
//   data?: any;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   relatedData?: any;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ExeatSchema>({
//     resolver: zodResolver(leaveSchema),
//   });

//   const [state, formAction] = useFormState(
//     type === "create" ? createExeat : updateExeat,
//     {
//       success: false,
//       error: false,
//     }
//   );

//   const onSubmit = handleSubmit((data) => {
//     formAction(data);
//   });

//   const router = useRouter();

//   const { student } = relatedData;

//   console.log("student: ", relatedData?.student?.id);

//   useEffect(() => {
//     if (state.success) {
//       toast(`Exeat has been ${type === "create" ? "created" : "updated"}`);
//       setOpen(false);
//       router.refresh();
//     }
//   }, [state, type, router, setOpen]);

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Create a new exeat" : "Update the exeat"}
//       </h1>
//       <div className="flex justify-between flex-wrap gap-4">
//         <div className="flex flex-col gap-2">
//           <label className="text-sm text-gray-500">Exeat type</label>
//           <select
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             {...register("type")}
//             defaultValue={data?.type}
//           >
//             <option value="">Select Exeat type</option>
//             <option value="Holiday">Holiday</option>
//             <option value="Medical">Medical</option>
//             <option value="Bereavement">Bereavement</option>
//             <option value="Study">Study</option>
//             <option value="Others">Others</option>
//           </select>
//           {errors.type?.message && (
//             <p className="text-xs text-red-400">{errors.type.message}</p>
//           )}
//         </div>

//         <InputField
//           label="Reason (required if type is others)"
//           name="reason"
//           type="text"
//           defaultValue={data?.reason}
//           register={register}
//           error={errors?.reason}
//         />

//         {data && (
//           <InputField
//             label="Id"
//             name="id"
//             defaultValue={data?.id}
//             register={register}
//             error={errors?.id}
//             hidden
//           />
//         )}

//         {type === "create" && (
//           <>
//             <InputField
//               label="Student Id"
//               name="studentId"
//               defaultValue={relatedData?.student?.id || ""}
//               register={register}
//               error={errors?.studentId}
//               hidden
//             />

//             <InputField
//               label="Status"
//               name="status"
//               defaultValue="PENDING"
//               register={register}
//               error={errors?.status}
//               hidden
//             />
//           </>
//         )}

//         <InputField
//           label="Comment (Optional)"
//           name="comments"
//           type="text"
//           defaultValue={data?.comments}
//           register={register}
//           error={errors?.comments}
//         />

//         <InputField
//           label="Start Date"
//           name="startDate"
//           defaultValue={data?.startDate.toISOString().split("T")[0]}
//           register={register}
//           error={errors?.startDate}
//           type="date"
//         />

//         <InputField
//           label="End Date"
//           name="endDate"
//           defaultValue={data?.endDate.toISOString().split("T")[0]}
//           register={register}
//           error={errors?.endDate}
//           type="date"
//         />

//         {type === "update" && (
//           <>
//             <div className="flex flex-col gap-2">
//               <label className="text-sm text-gray-500">Status</label>
//               <select
//                 className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//                 {...register("status")}
//                 defaultValue={data?.status || ""}
//               >
//                 <option value="">Select leave status</option>
//                 <option value="PENDING">PENDING</option>
//                 <option value="APPROVED">APPROVED</option>
//                 <option value="REJECTED">REJECTED</option>
//               </select>
//               {errors.status?.message && (
//                 <p className="text-xs text-red-400">{errors.status.message}</p>
//               )}
//             </div>

//             <InputField
//               label="Student Id"
//               name="studentId"
//               defaultValue={data?.studentId}
//               register={register}
//               error={errors?.studentId}
//               hidden
//             />
//           </>
//         )}
//       </div>

//       {state.error && (
//         <span className="text-red-500">Something went wrong!</span>
//       )}
//       <button type="submit" className="bg-deepGreen text-white p-2 rounded-md">
//         {type === "create" ? "Create" : "Update"}
//       </button>
//     </form>
//   );
// };

// export default ExeatForm;







"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { exeatSchema, ExeatSchema } from "@/lib/formValidationSchema";
import { createExeat, updateExeat } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const ExeatForm = ({
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
  } = useForm<ExeatSchema>({
    resolver: zodResolver(exeatSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createExeat : updateExeat,
    {
      success: false,
      error: false,
    }
  );

  // console.log("data", data);
  // console.log("data tacherID", data?.teacherId);
  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const { student } = relatedData;

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Exeat has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, type, router, setOpen]);

  console.log("related Data: ", relatedData);
  console.log("Data: ", data);

  // console.log("Teacher Data: ", relatedData?.teacher.id); // Check if teacher data is properly passed

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new exeat" : "Update the exeat"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Exeat type</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
            defaultValue={data?.type}
          >
            <option value="">Select leave type</option>
            <option value="Holiday">Holiday</option>
            <option value="Medical">Medical</option>
            <option value="Bereavement">Bereavement</option>
            <option value="Study">Study</option>
            <option value="Others">Others</option>
          </select>
          {errors.type?.message && (
            <p className="text-xs text-red-400">{errors.type.message}</p>
          )}
        </div>

        <InputField
          label="Reason (required if type is others)"
          name="reason"
          type="text"
          defaultValue={data?.reason}
          register={register}
          error={errors?.reason}
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

        {type === "create" && (
          <>
            <InputField
              label="Student Id"
              name="studentId"
              // defaultValue={data?.studentId}
              defaultValue={relatedData?.student?.id || ""}
              register={register}
              error={errors?.studentId}
              hidden
            />

            <InputField
              label="Status"
              name="status"
              // defaultValue={data?.teacherId}
              defaultValue="PENDING"
              register={register}
              error={errors?.status}
              hidden
            />
          </>
        )}

        <InputField
          label="Comment (Optional)"
          name="comments"
          type="text"
          defaultValue={data?.comments}
          register={register}
          error={errors?.comments}
        />

        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={data?.startDate.toISOString().split("T")[0]}
          register={register}
          error={errors?.startDate}
          type="date"
        />

        <InputField
          label="End Date"
          name="endDate"
          defaultValue={data?.endDate.toISOString().split("T")[0]}
          register={register}
          error={errors?.endDate}
          type="date"
        />

        {type === "update" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">Status</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("status")}
                defaultValue={data?.status || ""}
              >
                <option value="">Select leave status</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
              {errors.status?.message && (
                <p className="text-xs text-red-400">{errors.status.message}</p>
              )}
            </div>

            <InputField
              label="Student Id"
              name="studentId"
              defaultValue={data?.studentId}
              register={register}
              error={errors?.studentId}
              hidden
            />
          </>
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExeatForm;
