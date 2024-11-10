import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BirthdayCelebration from "@/components/BirthdayCelebration";
import { auth } from "@clerk/nextjs/server";

const teacher = {
  firstName: "John",
  birthday: new Date(2024, 10, 10),
};

// const authObject = await auth();
  const { userId } = auth();


const TeacherPage = () => {
  return (
    // <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
    <div className="p-4 flex flex-col gap-4">
      <BirthdayCelebration user={teacher} />
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Schedule</h1>
            <BigCalendarContainer type="teacherId" id={userId!} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
