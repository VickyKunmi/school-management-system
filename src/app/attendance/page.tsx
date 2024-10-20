"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import QrReader from "react-qr-scanner";

const QrReader = dynamic(() => import("react-qr-scanner"), {
  ssr: false, // Disable server-side rendering
});


interface QrData {
  text: string;
}

const Attendance = () => {
  const [scannedData, setScannedData] = useState("");
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  const previewStyle = {
    height: 450,
    width: 450,
  };

  const handleScan = (data: QrData | null) => {
    if (data) {
      console.log("Scanned Data:", data); // Add this line to debug
      setScannedData(data.text);
      setMessage("Scan successful");
    } else {
      console.log("No data scanned"); // Add this line to debug
    }
  };
  

  const handleError = (err: Error) => {
    setMessage("Error in scanning");
    console.error(err);
  };

  useEffect(() => {
    setIsClient(true); // Check if it's on the client
  }, []);

  return (
    <div className="p-2 mt-6">
      <h1 className="text-center font-bold">Scan Teacher&apos;s QR Code</h1>
      <div className="flex mt-5 justify-center gap-5 p-5">
        <div className="gap-8 flex">
          <label>Date</label>
          <input type="date" className="" />
        </div>
        <div className="gap-8 flex">
          <label>Start Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="cursor-pointer"
          />
        </div>
        <div className="gap-8 flex">
          <label>End Time</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-center items-center h-[50vh] mt-[10%]">
        {isClient && (
          <QrReader
            delay={100}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
        )}
      </div>

      {message && <p className="text-center">{message}</p>}
      {scannedData && (
        <p className="text-center">Scanned Data: {scannedData}</p>
      )}
    </div>
  );
};

export default Attendance;
