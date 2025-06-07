"use client";

import { useState, useEffect } from "react";
import { updateSettings, getSettings } from "@/lib/actions";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const [academicYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettings();
      console.log("Fetched settings:", settings); // Debugging line
      if (settings) {
        setAcademicYear(settings.academicYear || "");
        setTerm(settings.term || ""); // Ensure it's using enum values
      }
    };
    fetchSettings();
  }, []);
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await updateSettings(academicYear, term);
    if (response.success) {
      toast("Settings updated successfully");
    } else {
      toast(response.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Academic Year & Term</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Academic Year:
          </label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g. 2024-2025"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Term:
          </label>
          <select
            value={term}
            onChange={(e) =>
              setTerm(e.target.value as "First" | "Second" | "Third")
            }
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Term</option>
            <option value="First">First Term</option>
            <option value="Second">Second Term</option>
            <option value="Third">Third Term</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-deepGreen text-white py-2 rounded-lg hover:bg-lightGreen"
        >
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
