"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import Table from "@/components/Table";

import { fetchTeacherAndAttendance } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";

type Attendance = {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  signInTime: Date;
  signOutTime: Date | null;
  status: string;
  employee: { firstName: string; lastName: string };
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
  const [employee, setEmployee] = useState<Teacher | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined);





  useEffect(() => {
    if (!isLoaded) return; // Wait until auth state is loaded
    if (!userId) {
      setError("User is not authenticated");
      return;
    }
  
  


    const fetchData = async () => {
      console.log("role:", role);

      try {
        const data = await fetchTeacherAndAttendance(userId);
        
        if (!data) {
          setError("No attendance records found.");
          return;
        }
        
        const { employee, attendanceData, role } = data;
        console.log("Fetched data:", { employee, attendanceData, role });
    
        if (role === "staff") {
          setEmployee(employee);
        } else if (role === "admin") {
          setEmployee(employee ? employee : null);
        } else {
          setError("Admins cannot access this page.");
          return;
        }
    
        setAttendanceData(attendanceData);
        setRole(role);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching the data.");
      }
    };
    

    fetchData();


  }, [userId, isLoaded, role]);
  

  console.log("attendanceData:", attendanceData);
console.log("employee:", employee);
console.log("role:", role);




  
  const generateQRCode = async (
    type: "signIn" | "signOut",
    employeeId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const qrData = JSON.stringify({
        type,
        employeeId,
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
        {role !== "staff" && (
          <td className="p-4">
            {item.employee.firstName} {item.employee.lastName}
          </td>
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
    ...(role !== "staff"
      ? [
          {
            header: "Staff Name",
            accessor: "staffName",
            render: (employee: { firstName: string; lastName: string }) =>
              `${employee.firstName} ${employee.lastName}`,
          },
        ]
      : []),
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
      {role === "staff" && (
        <div className="flex gap-5 items-center justify-between">
          <button
            onClick={() => generateQRCode("signIn", employee?.id!)}
            className="bg-amber-500 text-white p-2 rounded-md"
          >
            Sign In Code
          </button>
          <button
            onClick={() => generateQRCode("signOut", employee?.id!)}
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
        {attendanceData.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No attendance records available.
          </div>
        )}
      </div>
    </div>
  );


};

export default Attendance;
