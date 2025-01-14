
"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import Table from "@/components/Table";

import { fetchTeacherAndAttendance } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { TeacherAttendance } from "@prisma/client";

type Attendance = {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  signInTime: Date;
  signOutTime: Date | null;
  status: string;
  teacher: {firstName: string; lastName: string}
};

// type AttendanceList = TeacherAttendance & {teacher: Teacher}



type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  img: string;
};



const Attendance = () => {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const [qrCode, setQrCode] = useState("");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log("User ID:", userId);
    console.log("Role from Session:", role);
  
    // Ensure the user is authenticated and data is loaded
    if (!isLoaded) {
      return; // Wait for user to be loaded
    }
  
    if (!userId) {
      setError("User is not authenticated");
      return;
    }
  
    const fetchData = async () => {
      try {
        const { teacher, attendanceData, role } = await fetchTeacherAndAttendance(userId);
        console.log("Fetched data:", { teacher, attendanceData, role });
    
        // If the role is "teacher", directly set the teacher object
        if (role === "teacher") {
          setTeacher(teacher); // teacher is a single object
        } else if (role === "admin") {
          // For the "admin" role, teacher will be an array, set the first teacher or null
          setTeacher(teacher ? teacher : null); // If teacher is found, set it, else set null
        } else {
          setError("Admins cannot access this page.");
        }
    
        setAttendanceData(attendanceData);
        setRole(role)
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching the data.");
      }
    };
    
  
    fetchData();
  }, [userId, isLoaded, role]);  // Re-run effect when userId or isLoaded changes
  
  

  const generateQRCode = async (
    type: "signIn" | "signOut",
    teacherId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const qrData = JSON.stringify({
        type,
        teacherId,
        timestamp: new Date().toISOString(),
        uniqueId: crypto.randomUUID(),
      });
      const generatedQR = await QRCode.toDataURL(qrData);
      setQrCode(generatedQR);
    } catch (err) {
      console.error("Error generating QR code", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderRow = (item: Attendance) => {
    const date = new Date(item.date);
    const signInTime = new Date(item.signInTime);
    const signOutTime = item.signOutTime ? new Date(item.signOutTime) : null;

    

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
          {role !== "teacher" && (
          <td className="p-4">{item.teacher.firstName} {item.teacher.lastName}</td>
        )}
         {/* <td className="p-4">{item.teacher.firstName} {item.teacher.lastName}</td> */}
        <td className="">{date.toLocaleDateString()}</td>
        <td>{signInTime.toLocaleTimeString()}</td>
        <td className="hidden md:table-cell">
          {signOutTime ? signOutTime.toLocaleTimeString() : "N/A"}
        </td>
        <td>{item.status}</td>
      </tr>
    );
  };


  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const columns = [
    ...(role !== "teacher" ? [
      {
        header: "Teacher Name",
        accessor: "teacherName",
        render: (teacher: { firstName: string; lastName: string }) => `${teacher.firstName} ${teacher.lastName}`,
      }
    ] : []),
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Sign In Time",
      accessor: "signInTime",
    },
    {
      header: "Sign Out Time",
      accessor: "signOutTime",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];


  
  return (
    <div className="p-4">
      {role === "teacher" && (
        <div className="flex gap-5 items-center justify-between">
          <button
            onClick={() => generateQRCode("signIn", teacher?.id!)}
            className="bg-amber-500 text-white p-2 rounded-md"
          >
            Sign In Code
          </button>
          <button
            onClick={() => generateQRCode("signOut", teacher?.id!)}
            className="bg-deepGreen text-white p-2 rounded-md"
          >
            Sign Out Code
          </button>
        </div>
      )}

      {qrCode && (
        <div className="mt-5">
          <Image width={500} height={500} src={qrCode} alt="QR Code" />
        </div>
      )}

      <div className="mt-4">
        <Table columns={columns} renderRow={renderRow} data={attendanceData} />
      </div>
    </div>
  );
};

export default Attendance;
