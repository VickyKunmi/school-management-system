
import prisma from "@/lib/prisma";
import React from "react";

type PayrollRecord = {
  id: string;
  salary: number;
  bonus?: number | null;
  deductions?: number | null;
  payDate: Date;
};

const PayrollView = async ({ employeeId }: { employeeId: string }) => {
  // Fetch payroll records for the given employee
  const payrolls: PayrollRecord[] = await prisma.payroll.findMany({
    where: { employeeId },
    orderBy: { payDate: "desc" },
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Payroll Records</h2>
      {payrolls.length === 0 ? (
        <p>No payroll records available.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Pay Date</th>
              <th className="px-4 py-2 text-left">Salary (GHC)</th>
              <th className="px-4 py-2 text-left">Bonus (GHC)</th>
              <th className="px-4 py-2 text-left">Deductions (GHC)</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-2">
                  {new Date(p.payDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{p.salary}</td>
                <td className="px-4 py-2">{p.bonus ?? 0}</td>
                <td className="px-4 py-2">{p.deductions ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PayrollView;
