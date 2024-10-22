"use client";

import React, { useEffect, useState } from "react";
import { Html5Qrcode, CameraDevice, Html5QrcodeResult } from "html5-qrcode";

const Attendance = () => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [result, setResult] = useState<string>("");
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

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
          handleQRCodeScan(decodedText);
        },
        (errorMessage) => {
          console.log("QR Code scanning error:", errorMessage);
        }
      )
      .catch((err) => {
        console.error("Failed to start scanner:", err);
      });
  };

  const handleQRCodeScan = (decodedText: string) => {
    console.log("QR Code Scanned:", decodedText);
    setResult(decodedText);

    setTimeout(() => {
      setResult("");
    }, 3000);
  };

  return (
    <div className="bg-yellow min-h-screen flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-8">
          Teacher Attendance QR Code Scanner
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">Date</label>
            <input type="date" className="border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">Start Time</label>
            <input type="time" className="border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">End Time</label>
            <input type="time" className="border border-gray-300 p-2 rounded" />
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

        {result && (
          <div className="bg-green-100 p-4 rounded-lg text-green-800">
            <h3 className="font-semibold">Scanned QR Code:</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
