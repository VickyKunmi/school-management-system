import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {
  examsData,
  exeatRequestData,
  leaveRequestData,
  role,
} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Exeat, Prisma, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ExeatLists = Exeat & { student: Student };

const ExeatList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const authObject = await auth();
  const { sessionClaims, userId } = authObject;
  const currentUserId = userId;

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    ...(role === "admin"
      ? [
          {
            header: "Name",
            accessor: "student",
            render: (row: ExeatLists) =>
              `${row.student.firstName} ${row.student.lastName}`,
          },
        ]
      : []),
    {
      header: "Applied Date",
      accessor: "appliedDate",
    },
    {
      header: "Start Date",
      accessor: "End Date",
    },
    {
      header: "End Date",
      accessor: "endDate",
      className: "hidden md:table-cell",
    },
    {
      header: " Exeat Type",
      accessor: "type",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
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

  const renderRow = (item: ExeatLists) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      {role === "admin" && (
        <td>
          {item.student.firstName} {item.student.lastName}
        </td>
      )}
      <td className="flex items-center gap-4 p-4">
        {new Date(item.createdAt).toLocaleDateString()}{" "}
      </td>
      <td>{new Date(item.startDate).toLocaleDateString()}</td>
      <td className="hidden md:table-cell">
        {new Date(item.endDate).toLocaleDateString()}{" "}
      </td>
      <td className="hidden md:table-cell">{item.type}</td>
      <td className="hidden md:table-cell">{item.status}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teacher/${item.id}`}></Link>
          {role === "admin" && (
            <FormContainer type="update" table="exeat" data={item} />
          )}
          {role === "admin" && (
            <FormContainer type="delete" table="exeat" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ExeatWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                student: {
                  firstName: { contains: value, mode: "insensitive" },
                  lastName: { contains: value, mode: "insensitive" },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  switch (role) {
    case "admin":
      break;
    case "student":
      query.student = { id: currentUserId! };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exeat.findMany({
      where: query,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exeat.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Exeat Request
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "student" && (
              <FormContainer type="create" table="exeat" />
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

export default ExeatList;
