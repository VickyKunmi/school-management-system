import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Employee, Prisma} from "@prisma/client";
import Image from "next/image";


type EmployeeLists = Employee;

const EmployeeList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Name",
      accessor: "name",
      className: "hidden md:table-cell",
    },
    {
      header: "Employee Id",
      accessor: "employeeId",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "Phone",
      className: "hidden lg:table-cell",
    },
    {
        header: "Job Title",
        accessor: "jobTitle",
        className: "hidden lg:table-cell",
      },
    {
      header: "Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: EmployeeLists) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          // src={item.img || "/noAvatar.png"}
          src={item.img}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td>
        <h3 className="font-semibold">
          {item.firstName + " " + item.lastName}
        </h3>
      </td>

      <td>
        {item.employeeId} 
      </td>
      <td className="hidden md:table-cell">{item.phone} </td>

      <td className="hidden md:table-cell">
        {item.jobTitle}
      </td>
      <td className="hidden md:table-cell">
       {item.address}
      </td>
      <td>
        <div className="flex items-center gap-2">
          
          {role === "admin" && (
            <>
              <FormContainer type="update" table="employee" data={item} />
              <FormContainer type="delete" table="employee" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.EmployeeWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search": {
            query.OR = [
              { firstName: { contains: value, mode: "insensitive" } },

              { lastName: { contains: value, mode: "insensitive" } },
            ];
            break;
          }
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.employee.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.employee.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormContainer table="employee" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EmployeeList;
