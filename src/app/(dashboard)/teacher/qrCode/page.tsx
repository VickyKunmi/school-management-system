"use client";

import { useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import Table from "@/components/Table";

import { teachersAttendanceData } from "@/lib/data";


type Attendance = {
  id: number;
  date: string;
  signInTime: string;
  signOutTime: string;
  status: string;
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

const QrCode = () => {
  const [qrCode, setQrCode] = useState("");

  const generateQRCode = async (type) => {
    try {
      const qrData =
        type === "signIn" ? "SignIn URL or data" : "SignUp URL or data";
      const generatedQR = await QRCode.toDataURL(qrData);
      setQrCode(generatedQR);
    } catch (err) {
      console.error("Error generating QR code", err);
    }
  };

  const renderRow = (item: Attendance) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
          <h3 className="font-semibold">{item.date} </h3>
      </td>
      <td className="">

      {item.signInTime} 
      </td>
      <td className="hidden md:table-cell">{item.signOutTime} </td>
      
      <td>
        {item.status}
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      {/* TOP BUTTONS */}
      <div className=" flex gap-5 items-center justify-between">
        <button
          onClick={() => generateQRCode("signIn")}
          className="bg-amber-500 text-white p-2 rounded-md"
        >
          Sign In Code
        </button>
        <button
          onClick={() => generateQRCode("signUp")}
          className="bg-deepGreen text-white p-2 rounded-md"
        >
          Sign Up Code
        </button>
      </div>

      {qrCode && (
        <div className="mt-5" >
          <Image width={500} height={500} src={qrCode} alt="QR Code" />{" "}
        </div>
      )}

      <div className="">
        <Table columns={columns} renderRow={renderRow} data={teachersAttendanceData} />
      </div>
    </div>
  );
};

export default QrCode;
