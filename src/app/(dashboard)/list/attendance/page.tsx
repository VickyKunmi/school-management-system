"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import Table from "@/components/Table";

import { teachersAttendanceData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { auth } from "@clerk/nextjs/server";
import { fetchTeacherAndAttendance } from "@/lib/actions";

type Attendance = {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  signInTime: Date;
  signOutTime: Date | null;
  status: string;
};

type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  img: string;
};

const columns = [
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

const Attendance = () => {
  const [qrCode, setQrCode] = useState("");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  // const [teacherId, setTeacherId] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);


  useEffect(() => {

    
    const fetchData = async () => {
      try {

        
        const { teacher, attendanceData } = await fetchTeacherAndAttendance();
        setTeacher(teacher);
        setAttendanceData(attendanceData);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <td className="flex items-center gap-4 p-4">
          <h3 className="font-semibold">{date.toLocaleDateString()}</h3>
        </td>
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

  return (
    <div className="p-4">
      {/* TOP BUTTONS */}

      <div className=" flex gap-5 items-center justify-between">
        <button
          // onClick={() => generateQRCode("signIn", teacherId!)}
          onClick={() => generateQRCode("signIn", teacher?.id!)}
          className="bg-amber-500 text-white p-2 rounded-md"
        >
          Sign In Code
        </button>
        <button
          // onClick={() => generateQRCode("signOut", teacherId!)}
          onClick={() => generateQRCode("signOut", teacher?.id!)}
          className="bg-deepGreen text-white p-2 rounded-md"
        >
          Sign Out Code
        </button>
      </div>

      {qrCode && (
        <div className="mt-5">
          <Image width={500} height={500} src={qrCode} alt="QR Code" />{" "}
        </div>
      )}

      <div className="">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={attendanceData}
        />
      </div>
    </div>
  );
};

export default Attendance;
