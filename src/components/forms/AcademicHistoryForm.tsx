import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchema";

type AcademicResult = {
  id: number;
  academicYear: string;
  term: string;
  subject: {
    id: number;
    name: string;
  };
  score: number;
  grade: string;
};

type StudentData = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  admissionNumber: string;
  results: AcademicResult[];
};

type AcademicHistoryFormProps = {
  admissionId: number | null;
};

const AcademicHistoryForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update" | "view";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  // Use relatedData to get the complete student academic record
  const student: StudentData | null = relatedData?.student || null;

  if (!student) {
    return (
      <div className="p-4">
        <p>No academic history available for this student.</p>
      </div>
    );
  }

  // Group the results by academicYear and term
  const groupedResults = student.results.reduce((acc: any, result: AcademicResult) => {
    const key = `${result.academicYear}-${result.term}`;
    if (!acc[key]) {
      acc[key] = {
        academicYear: result.academicYear,
        term: result.term,
        subjects: [],
      };
    }
    acc[key].subjects.push(result);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded-md w-full max-w-3xl shadow-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Academic Record</h2>
        </div>
        {Object.values(groupedResults).map((group: any) => (
          <div key={`${group.academicYear}-${group.term}`} className="mb-8">
            <h3 className="font-semibold text-lg mb-2">
              {group.academicYear} - {group.term}
            </h3>
            <table className="w-full border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left border-b">Subject</th>
                  <th className="py-2 px-4 text-left border-b">Score</th>
                  <th className="py-2 px-4 text-left border-b">Grade</th>
                </tr>
              </thead>
              <tbody>
                {group.subjects.map((result: AcademicResult) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{result.subject.name}</td>
                    <td className="py-2 px-4 border-b">{result.score}</td>
                    <td className="py-2 px-4 border-b">{result.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicHistoryForm;
