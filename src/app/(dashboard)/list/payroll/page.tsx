import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Employee, Prisma } from "@prisma/client";
import React from "react";

type EmployeeList = Employee; // No longer including payroll data

const EmployeeListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Job Title",
      accessor: "jobTitle",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: EmployeeList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td>{`${item.firstName} ${item.lastName}`}</td>
      <td>{item.jobTitle}</td>
      <td>{item.email}</td>
      <td>{item.phone}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormContainer
            table="payroll"
            type="create"
            data={{ employeeId: item.id }}
          />
          <FormContainer
            table="payroll"
            type="view"
            data={{ employeeId: item.id }}
          />
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.EmployeeWhereInput = {};

  if (queryParams.search) {
    query.OR = [
      { firstName: { contains: queryParams.search, mode: "insensitive" } },
      { lastName: { contains: queryParams.search, mode: "insensitive" } },
      { jobTitle: { contains: queryParams.search, mode: "insensitive" } },
      { email: { contains: queryParams.search, mode: "insensitive" } },
    ];
  }

  // Fetch all employees instead of payroll
  const [data, count] = await prisma.$transaction([
    prisma.employee.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.employee.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Employees</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <FormContainer table="employee" type="create" /> */}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EmployeeListPage;
