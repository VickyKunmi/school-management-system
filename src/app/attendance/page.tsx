"use client";

import React, { useEffect, useState } from "react";
import { Html5Qrcode, CameraDevice, Html5QrcodeResult } from "html5-qrcode";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { AiOutlineLogout } from "react-icons/ai";
import {
  createAttendance,
  updateSignOutTime,
  validateQRCode,
} from "@/lib/actions";
import Image from "next/image";

const Attendance = () => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  // const [result, setResult] = useState<string>("");
  const [result, setResult] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    img: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [scanningInProgress, setScanningInProgress] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [attendanceData, setAttendanceData] = useState({
    teacherId: "",
    date: new Date().toISOString().split("T")[0], // Still in ISO format, which is fine for date input
    startTime: new Date(), // Use a Date object for startTime
    endTime: new Date(), // Use a Date object for endTime
    signInTime: new Date(), // Use a Date object for signInTime
    signOutTime: null,
    status: "Absent" as "Present" | "Absent",
    qrCode: "",
    expiresAt: "" as string,
  });

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        setDevices(devices);
        if (devices.length > 0) {
          setSelectedDeviceId(devices[0].id);
        }
      })
      .catch((err) => console.error("Error fetching devices", err));

    return () => {
      if (scanner) {
        scanner
          .stop()
          .catch((err) => console.error("Error stopping scanner", err));
      }
    };
  }, [scanner]);

  const startScanner = () => {
    if (!selectedDeviceId) return;

    const html5QrCode = new Html5Qrcode("reader");
    setScanner(html5QrCode);

    html5QrCode
      .start(
        { deviceId: { exact: selectedDeviceId } },
        {
          fps: 10,
          qrbox: 350,
        },
        (decodedText: string, decodedResult: Html5QrcodeResult) => {
          console.log("Scanned result:", decodedText);
          handleQRCodeScan(decodedText);
        },
        (errorMessage) => {
          console.warn("Scanning error:", errorMessage);
          if (!errorMessage.includes("NotFoundException")) {
            console.error("QR Code scanning error:", errorMessage);
          }
          // console.log("QR Code scanning error:", errorMessage);
        }
      )
      .catch((err) => {
        console.error("Failed to start scanner:", err);
      });
  };

  const handleSignOut = async () => {
    const teacherId = result?.id; // Ensure the teacher ID is available from context or state

    if (!teacherId) {
      console.error("Teacher ID not found.");
      return;
    }

    const response = await updateSignOutTime(teacherId);

    if (response.success) {
      console.log(response.message);
    } else {
      console.error(response.message);
    }
  };

  // const handleQRCodeScan = async (decodedText: string) => {
  //   // console.log("Decoded QR Code Text:", decodedText);
  //   try {
  //     const result = await validateQRCode(decodedText);

  //     if (result.success && result.data) {
  //       setResult(result.data);
  //       setError(null);

  //       if (decodedText.includes("signOut")) {
  //         await handleSignOut();
  //       }

  //       const currentSignInTime = new Date(); // Current date and time
  //       const attendanceData = {
  //         teacherId: result.data.id,
  //         date: new Date(date),
  //         startTime: new Date(`${date}T${startTime}`),
  //         endTime: new Date(`${date}T${endTime}`),
  //         signInTime: currentSignInTime,
  //         signOutTime: null,
  //         status: "Present" as "Present",
  //         qrCode: decodedText,
  //         expiresAt: new Date(new Date().getTime() + 10 * 60 * 1000), // Expiry time (10 minutes later)
  //       };

  //       // Ensure attendanceData contains Date objects for time-related fields
  //       setAttendanceData({
  //         ...attendanceData,
  //         date: new Date(date).toISOString(),
  //         startTime: new Date(`${date}T${startTime}`),
  //         endTime: new Date(`${date}T${endTime}`),
  //         signInTime: new Date(),
  //         signOutTime: null,
  //         status: "Present", // Ensure this is a valid status value (either "Absent" or "Present")
  //         qrCode: decodedText,
  //         expiresAt: new Date(
  //           new Date().getTime() + 10 * 60 * 1000
  //         ).toISOString(),
  //       });

  //       const response = await createAttendance(attendanceData);

  //       if (response.success) {
  //         console.log("Attendance record created successfully!");
  //       } else {
  //         console.error("Error creating attendance record:", response.message);
  //       }
  //     } else {
  //       console.error("QR Code validation failed:", result.message);
  //       setError(result.message);
  //     }
  //   } catch (err) {
  //     console.error("Error parsing QR Code data:", err);
  //     setError("An error occurred while processing the QR code.");
  //   }

  //   setTimeout(() => {
  //     setResult(null);
  //     setError(null);
  //   }, 60000); // Clear the result and error after 1 minute
  // };

  const handleQRCodeScan = async (decodedText: string) => {
    if (scanningInProgress) return; // If scan is already in progress, do nothing

    setScanningInProgress(true);


    try {
      const result = await validateQRCode(decodedText);

      if (result.success && result.data) {
        // Move the state setting to a separate useEffect or set it conditionally
        setResult(result.data);
        setError(null);

        // Handle sign-out logic conditionally
        if (decodedText.includes("signOut")) {
          await handleSignOut();
        }

        const currentSignInTime = new Date(); // Current date and time
        const endTimeDate = new Date(`${date}T${endTime}`); // Create a Date object for the end time

        // Determine if the user is late
        const isLate = currentSignInTime > endTimeDate;

        // Set the status as Present or Absent based on other conditions
        const status = isLate ? "Present" : "Present";

        // Prepare the attendance data
        const attendanceData = {
          teacherId: result.data.id,
          date: new Date(date),
          startTime: new Date(`${date}T${startTime}`),
          endTime: new Date(`${date}T${endTime}`),
          signInTime: currentSignInTime,
          signOutTime: null,
          status: "Present" as "Present",
          qrCode: decodedText,
          expiresAt: new Date(new Date().getTime() + 10 * 60 * 1000), // Expiry time (10 minutes later)
        };

        // Ensure attendanceData contains Date objects for time-related fields
        setAttendanceData({
          ...attendanceData,
          date: new Date(date).toISOString(),
          startTime: new Date(`${date}T${startTime}`),
          endTime: new Date(`${date}T${endTime}`),
          signInTime: new Date(),
          signOutTime: null,
          status: "Present",
          qrCode: decodedText,
          expiresAt: new Date(
            new Date().getTime() + 10 * 60 * 1000
          ).toISOString(),
        });

        const response = await createAttendance(attendanceData);

        if (response.success) {
          // console.log("Attendance record created successfully!");
          // const userName = result.data.firstName || "User"; // Replace with actual user name
          const userName = `${result.data.firstName || "User"} ${result.data.lastName || ""}`.trim();
          const message = `Attendance is recorded for ${userName} as ${status}`;

          const utterance = new SpeechSynthesisUtterance(message);
          window.speechSynthesis.speak(utterance);
        } else {
          console.error("Error creating attendance record:", response.message);
        }
      } else {
        console.error("QR Code validation failed:", result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error("Error parsing QR Code data:", err);
      setError("An error occurred while processing the QR code.");
    }

    // Clear the result and error after 1 minute
    setTimeout(() => {
      setScanningInProgress(false)
      setResult(null);
      setError(null);
    }, 30000);
  };

  return (
    <>
      <div className="bg-yellow min-h-screen flex items-center justify-center p-5 relative">
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <SignOutButton>
            <button className="bg-white text-deepGreen  p-2 rounded-full">
              <AiOutlineLogout className="w-8 h-8" />
            </button>
          </SignOutButton>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl w-full">
          <h1 className="text-2xl font-bold text-center mb-8">
            Teacher Attendance QR Code Scanner
          </h1>
          {result && (
            <div className="bg-green-100 p-4 rounded-lg text-green-800">
              <h3 className="font-semibold">Scanned Teacher Details:</h3>
              <p>
                Name: {result.firstName} {result.lastName}
              </p>
              {result.img && (
                <div className="mt-4">
                  <Image
                    width={120}
                    height={120}
                    src={result.img}
                    alt="Teacher Image"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-100 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-2">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-2">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
            {devices.length > 0 && (
              <select
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full lg:w-auto"
              >
                {devices.map((device, index) => (
                  <option key={index} value={device.id}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={startScanner}
              className="bg-deepGreen text-white px-4 py-2 rounded-lg w-full lg:w-auto"
            >
              Start Scanning
            </button>
          </div>

          <div
            id="reader"
            className="w-full h-64 border border-gray-300 rounded-lg mb-4 overflow-hidden"
            style={{ maxHeight: "300px" }}
          />

          {/* {result && (
            <div className="bg-green-100 p-4 rounded-lg text-green-800">
              <h3 className="font-semibold">Scanned QR Code:</h3>
              <p>{result.firstName}</p>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Attendance;
