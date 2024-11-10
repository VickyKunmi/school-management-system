"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>
})

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>
})

const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>
})


const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>
})


const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>
})


const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>
})

const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>
})


const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>
})

const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>
})


const LeaveForm = dynamic(() => import("./forms/LeaveForm"), {
  loading: () => <h1>Loading...</h1>
})


const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>
})


const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>
})

const ExeatForm = dynamic(() => import("./forms/ExeatForm"), {
  loading: () => <h1>Loading...</h1>
})


const forms: {
  [key: string]: (setOpen:Dispatch<SetStateAction<boolean>>, type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (setOpen, type, data) => <TeacherForm type={type} data={data} setOpen={setOpen} />,
  student: (setOpen, type, data) => <StudentForm type={type} data={data} setOpen={setOpen} />,
  parent: (setOpen, type, data) => <ParentForm type={type} data={data} setOpen={setOpen} />,
  class: (setOpen, type, data) => <ClassForm type={type} data={data} setOpen={setOpen} />,
  subject: (setOpen, type, data) => <SubjectForm type={type} data={data} setOpen={setOpen} />,
  lesson: (setOpen, type, data) => <LessonForm type={type} data={data} setOpen={setOpen} />,
  exam: (setOpen, type, data) => <ExamForm type={type} data={data} setOpen={setOpen} />,
  assignment: (setOpen, type, data) => <AssignmentForm type={type} data={data} setOpen={setOpen} />,
  result: (setOpen, type, data) => <ResultForm type={type} data={data} setOpen={setOpen} />,
  event: (setOpen, type, data) => <EventForm type={type} data={data} setOpen={setOpen} />,
  announcement: (setOpen, type, data) => <AnnouncementForm type={type} data={data} setOpen={setOpen} />,
  leave: (setOpen, type, data) => <LeaveForm type={type} data={data} setOpen={setOpen} />,
  exeat: (setOpen, type, data) => <ExeatForm type={type} data={data} setOpen={setOpen} />,
};
const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "leave"
    | "exeat"

  type: "create" | "update" | "delete" | "message" | "view";
  data?: any;
  id?: number | string;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lightGreen"
      : type === "update"
      ? "bg-yellow"
      : "bg-deepGreen";
  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          Are you sure you wnat to delete this {table}{" "}
        </span>
        <button className="bg-red-600 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type==="create" || type === "update" ? (
      forms[table](setOpen, type, data)
    ) : "form not found";
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
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] ">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
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
