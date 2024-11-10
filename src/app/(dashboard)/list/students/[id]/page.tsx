import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO */}

          <div className="bg-yellow py-6 rounded-md px-4 flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="/me.jpg"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">Oyekunle Victory</h1>
              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab
                esse quaerat error numquam illum, dolorum in eveniet hic
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3   flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>A</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3  flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>2024-13-05</span>
                </div>
                {/* <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3  flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>Student@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3  flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>0206403085</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-lg font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-lg font-semibold">2</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-lg font-semibold">6</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-lg font-semibold">SHS</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="font-bold">Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-yellow text-black" href={`/list/lessons?classId=${2}`}>
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-lightGreen text-black" href={`/list/teachers?classId=${2}`}>
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-orange-200 text-black" href={`/list/exams?classId=${2}`}>
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-amber-200 text-black" href={`/list/assignments?classId=${2}`}>
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-lime-200 text-black" href={`/list/results?studentId=${"student2"}`}>
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
