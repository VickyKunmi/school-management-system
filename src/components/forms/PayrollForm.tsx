import { createPayroll, getPayrollsByEmployee, updatePayroll } from "@/lib/actions";
import { payrollSchema, PayrollSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { Payroll } from "@prisma/client";

const initialState = {
  message: "",
  success: false,
  error: false,
};

const PayrollForm = ({
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
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<PayrollSchema>({
    resolver: zodResolver(payrollSchema),
  });


  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const employeeId = relatedData?.id || data?.employeeId;

  useEffect(() => {
    if (type === "view" && employeeId) {
      const fetchPayrolls = async () => {
        try {
          const result = await getPayrollsByEmployee(employeeId);
          setPayrolls(result);
        } catch (error) {
          console.error("Error fetching payroll data:", error);
        }
      };
      fetchPayrolls();
    }
  }, [type, employeeId]);

  const [state, formAction] = useFormState(
    type === "create" ? createPayroll : updatePayroll,
    initialState
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Payroll Data Submitted:", data);
    formAction(data);
  });

  const router = useRouter();


  useEffect(() => {
    if (type === "create" && (relatedData?.id || data?.employeeId)) {
      setValue("employeeId", relatedData?.id || data?.employeeId);
    }
  }, [type, relatedData, data, setValue]);
  

  useEffect(() => {
    if (state.success) {
      toast(`Payroll has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };




  if (type === "view") {
    return (
      <div className="p-4 bg-white rounded-md">
        <h1 className="text-xl font-semibold">Payroll Details</h1>
        {payrolls.length > 0 ? (
          <table className="w-full border-collapse border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Salary (GHC)</th>
                <th className="border p-2">Bonus (GHC)</th>
                <th className="border p-2">Deductions (GHC)</th>
                <th className="border p-2">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll) => (
                <tr key={payroll.id} className="border text-center">
                  <td className="p-2">{payroll.salary}</td>
                  <td className="p-2">{payroll.bonus}</td>
                  <td className="p-2">{payroll.deductions}</td>
                  <td className="p-2">{new Date(payroll.payDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No payroll records found for this employee.</p>
        )}
        {/* <button className="mt-4 bg-red-500 text-white p-2 rounded-md" onClick={() => setOpen(false)}>Close</button> */}
      </div>
    );
  }




  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add a new payroll" : type === "update" ? "Update payroll" : "View payroll"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">

      <InputField
            label="Employee Id"
            name="employeeId"
            defaultValue={data?.employeeId}
            register={register}
            error={errors?.employeeId}
            // hidden
            readOnly
          />


        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* {data && (
          
        )} */}


        <InputField
          label="Salary (GHC)"
          name="salary"
          defaultValue={data?.salary}
          register={register}
          error={errors?.salary}
          
         
        />
        <InputField
          label="Bonus (GHC)"
          name="bonus"
          defaultValue={data?.bonus}
          register={register}
          error={errors?.bonus}
          
         
        />

        <InputField
          label="Deductions (GHC)"
          name="deductions"
          defaultValue={data?.deductions}
          register={register}
          error={errors?.deductions}
          
         
        />

        <InputField
          label="Pay date"
          name="payDate"
        //   defaultValue={data?.payDate.toISOString().split("T")[0]}
        defaultValue={data?.payDate ? new Date(data.payDate).toISOString().split("T")[0] : ""}
          register={register}
          error={errors?.payDate}
          type="date"
        />
      </div>
      {state.error && (
        <span className="text-red-500">
          {state.error && (
            <div className="text-red-500 text-sm">
              <p>{state.message}</p>
            </div>
          )}
        </span>
      )}
      <button className="bg-deepGreen text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}{" "}
      </button>
    </form>
  );
};

export default PayrollForm;
