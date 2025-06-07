// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import InputField from "../InputField";
// import Image from "next/image";
// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { enrollmentSchema, EnrollmentSchema } from "@/lib/formValidationSchema";
// import { useFormState } from "react-dom";
// import { createEnrollment, getSettings, updateEnrollment } from "@/lib/actions";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// const initialState = {
//   message: "",
//   success: false,
//   error: false,
// };

// const EnrollmentForm = ({
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
//     setValue,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<EnrollmentSchema>({
//     resolver: zodResolver(enrollmentSchema),
//   });

//   const [academicYear, setAcademicYear] = useState("");
//   const [term, setTerm] = useState("");
//   const [status, setStatus] = useState("Active");


//   useEffect(() => {
//     // Fetch the current academic year and term
//     const fetchSettings = async () => {
//       const settings = await getSettings();
//       if (settings) {
//         setAcademicYear(settings.academicYear);
//         setTerm(settings.term);

//         // Set default values in form fields
//         setValue("academicYear", settings.academicYear);
//         setValue("term", settings.term);
//       }
//     };

//     fetchSettings();
//   }, [setValue]);

//   const [state, formAction] = useFormState(
//     type === "create" ? createEnrollment : updateEnrollment,
//     initialState
//   );
//   const onSubmit = handleSubmit(async (formData) => {
//     console.log("Form data submitted:", formData);
//     const response =
//       type === "create"
//         ? await createEnrollment(formData)
//         : await updateEnrollment(formData);

//     if (response.success) {
//       toast(`Student has been ${type === "create" ? "Enrolled" : "Updated"}!`);
//       setOpen(false);
//       router.refresh();
//     } else {
//       toast.error(response.message || "Something went wrong!");
//     }
//   });

//   const router = useRouter();

//   useEffect(() => {
//     if (state.success) {
//       toast(`Student has been ${type === "create" ? "Enrolled" : "updated"}!`);
//       setOpen(false);
//       router.refresh();
//     }
//     if (state.error) {
//       toast.error(state.message || "Something went wrong!");
//     }
//   }, [state, router, type, setOpen]);

//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };
//   useEffect(() => {
//     console.log("Enrollment data:", data);
//   }, [data]);

//   const { grades, classes } = relatedData;

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Enroll a student" : "Update student enrollment"}
//       </h1>

//       <div className="flex justify-between flex-wrap gap-4">
//         <InputField
//           label="Admission Id"
//           name="admissionId"
//           defaultValue={data?.id}
//           register={register}
//           error={errors?.admissionId}
//           hidden
//         />

//         {type === "create" && (
//           <>
//             <InputField
//               label="First Name"
//               name="firstName"
//               defaultValue={data?.firstName}
//               register={register}
//               readOnly
//             />

//             <InputField
//               label="Middle Name (Optional)"
//               name="middleName"
//               defaultValue={data?.middleName}
//               register={register}
//               readOnly
//             />

//             <InputField
//               label="Last Name"
//               name="lastName"
//               defaultValue={data?.lastName}
//               register={register}
//               readOnly
//             />
//           </>
//         )}

        

//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//           <label className="text-sm text-gray-500">Grade</label>
//           <select
//             {...register("gradeId")}
//             defaultValue={data?.gradeId || ""}
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             required
//           >
//             <option value="">Select Grade</option>
//             {relatedData.grades?.map((grade: { id: number; level: string }) => (
//               <option key={grade.id} value={grade.id}>
//                 {grade.level}
//               </option>
//             ))}
//           </select>
//           {errors.gradeId && (
//             <p className="text-red-500 text-sm">{errors.gradeId.message}</p>
//           )}
//         </div>


//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//           <label className="text-sm text-gray-500">Class</label>
//           <select
//             {...register("classId")}
//             defaultValue={data?.classId || ""}
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             // onChange={(e) => setValue("classId", e.target.value)}
//             required
//           >
//             <option value="">Select Class</option>
//             {relatedData.classes?.map((cls: { id: number; name: string }) => (
//               <option key={cls.id} value={cls.id}>
//                 {cls.name}
//               </option>
//             ))}
//           </select>
//           {errors.classId && (
//             <p className="text-red-500 text-sm">{errors.classId.message}</p>
//           )}
//         </div>

//         <InputField
//           label="Academic year"
//           name="academicYear"
//           defaultValue={data?.academicYear}
//           register={register}
//           error={errors.academicYear}
//           readOnly
//         />

//         <InputField
//           label="Term"
//           name="term"
//           defaultValue={data?.term}
//           register={register}
//           error={errors.term}
//           readOnly
//         />

//         <div className="flex flex-col gap-2 w-full md:w-1/4">
//           <label className="text-sm text-gray-500">Status</label>
//           <select
//             {...register("status")} 
//             defaultValue={data?.status || ""}
//             className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
//             onChange={
//               (e) =>
//                 setStatus(e.target.value as "Active" | "Completed" | "Dropped") // Update to setStatus
//             }
//             required
//           >
//             <option value="">Select Status</option>
//             <option value="Active">Active</option>
//             <option value="Completed">Completed</option>
//             <option value="Dropped">Dropped</option>
//           </select>
//           {errors.status && (
//             <p className="text-red-500 text-sm">{errors.status.message}</p>
//           )}
//         </div>

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
//       </div>

//       {state.error && (
//         <span className="text-red-500">
//           {state.error && (
//             <div className="text-red-500 text-sm">
//               <p>{state.message}</p>
//             </div>
//           )}
//         </span>
//       )}

//       <button type="submit" className="bg-deepGreen text-white p-2 rounded-md">
//         {type === "create" ? "Create" : "Update"}{" "}
//       </button>
//     </form>
//   );
// };

// export default EnrollmentForm;






"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { enrollmentSchema, EnrollmentSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createEnrollment, getSettings, updateEnrollment } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const initialState = {
  message: "",
  success: false,
  error: false,
};

const EnrollmentForm = ({
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
  } = useForm<EnrollmentSchema>({
    resolver: zodResolver(enrollmentSchema),
  });

  const [academicYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("Active");
  const [selectedGrade, setSelectedGrade] = useState<number | "">("");
  const [filteredClasses, setFilteredClasses] = useState(relatedData.classes || []);

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

  useEffect(() => {
    // Filter classes based on the selected grade
    if (selectedGrade !== "") {
      const filtered = relatedData.classes.filter(
        (cls: { gradeId: number }) => cls.gradeId === selectedGrade
      );
      setFilteredClasses(filtered);
    } else {
      setFilteredClasses(relatedData.classes);
    }
  }, [selectedGrade, relatedData.classes]);

  const [state, formAction] = useFormState(
    type === "create" ? createEnrollment : updateEnrollment,
    initialState
  );
  const onSubmit = handleSubmit(async (formData) => {
    console.log("Form data submitted:", formData);
    const response =
      type === "create"
        ? await createEnrollment(formData)
        : await updateEnrollment(formData);

    if (response.success) {
      toast(`Student has been ${type === "create" ? "Enrolled" : "Updated"}!`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(response.message || "Something went wrong!");
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "Enrolled" : "updated"}!`);
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
    console.log("Enrollment data:", data);
  }, [data]);

  const { grades } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Enroll a student" : "Update student enrollment"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Admission Id"
          name="admissionId"
          defaultValue={data?.id}
          register={register}
          error={errors?.admissionId}
          hidden
        />

        {type === "create" && (
          <>
            <InputField
              label="First Name"
              name="firstName"
              defaultValue={data?.firstName}
              register={register}
              readOnly
            />

            <InputField
              label="Middle Name (Optional)"
              name="middleName"
              defaultValue={data?.middleName}
              register={register}
              readOnly
            />

            <InputField
              label="Last Name"
              name="lastName"
              defaultValue={data?.lastName}
              register={register}
              readOnly
            />
          </>
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm text-gray-500">Grade</label>
          <select
            {...register("gradeId")}
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value))}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            required
          >
            <option value="">Select Grade</option>
            {grades?.map((grade: { id: number; level: string }) => (
              <option key={grade.id} value={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId && (
            <p className="text-red-500 text-sm">{errors.gradeId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm text-gray-500">Class</label>
          <select
            {...register("classId")}
            defaultValue={data?.classId || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            required
          >
            <option value="">Select Class</option>
            {filteredClasses?.map((cls: { id: number; name: string }) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-red-500 text-sm">{errors.classId.message}</p>
          )}
        </div>

        <InputField
          label="Academic year"
          name="academicYear"
          defaultValue={data?.academicYear}
          register={register}
          error={errors.academicYear}
          readOnly
        />

        <InputField
          label="Term"
          name="term"
          defaultValue={data?.term}
          register={register}
          error={errors.term}
          readOnly
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-sm text-gray-500">Status</label>
          <select
            {...register("status")} 
            defaultValue={data?.status || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            onChange={
              (e) =>
                setStatus(e.target.value as "Active" | "Completed" | "Dropped") // Update to setStatus
            }
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
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

      <button type="submit" className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}{" "}
      </button>
    </form>
  );
};

export default EnrollmentForm;
