"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useFormState } from "react-dom";
import {
  deleteClass,
  deleteAdmission,
  deleteEnrollment,
  deleteSubject,
  deleteGrade,
  deleteEmployee,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";




const iconMap: Record<string, string> = {
  create: "/create.png",    // Replace with your actual file name for create
  update: "/update.png",   // Replace with your actual file name for update
  delete: "/delete.png",  // Replace with your actual file name for delete
  view: "/view.png",      // Replace with your actual file name for view
};



const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  admission: deleteAdmission,
  enrollment: deleteEnrollment,
  
  attendance: deleteSubject,

  grade: deleteGrade,
  employee: deleteEmployee,
};
const EmployeeForm = dynamic(() => import("./forms/EmployeeForm"), {
  loading: () => <h1>Loading...</h1>,
});

const AdmissionForm = dynamic(() => import("./forms/AdmissionForm"), {
  loading: () => <h1>Loading...</h1>,
});

const EnrollmentForm = dynamic(() => import("./forms/EnrollmentForm"), {
  loading: () => <h1>Loading...</h1>,
});



const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const GradeForm = dynamic(() => import("./forms/GradeForm"), {
  loading: () => <h1>Loading...</h1>,
});

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});


const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});



const AcademicHistoryForm = dynamic(() => import("./forms/AcademicHistoryForm"), {
  loading: () => <h1>Loading...</h1>,
});

const PayrollForm = dynamic(() => import("./forms/PayrollForm"), {
  loading: () => <h1>Loading...</h1>,
});




const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update" | "view",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  employee: (setOpen, type, data, relatedData) => (
    <EmployeeForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  admission: (setOpen, type, data, relatedData) => (
    <AdmissionForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),


  enrollment: (setOpen, type, data, relatedData) => (
    <EnrollmentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  
 
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),

  grade: (setOpen, type, data, relatedData) => (
    <GradeForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),


  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),

 
  result: (setOpen, type, data, relatedData) => (
    <ResultForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),



  academicHistory: (setOpen, type, data, relatedData) => (
    <AcademicHistoryForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),


  payroll: (setOpen, type, data, relatedData) => (
    <PayrollForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),

  
};
const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lightGreen"
      : type === "update"
      ? "bg-yellow"
      : type === "view"
      ? "bg-deepGreen"
      : "bg-deepGreen";
  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" defaultValue={id} hidden />
        <span className="text-center font-medium">
          Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-600 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" || type === "view" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "form not found"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] ">
            <Form />
            <div
              className="absolute top-8 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
