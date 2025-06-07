import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client"; // Import Prisma types

type AdmissionList = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  admissionNumber: string;
};

const AcademicHistory = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const columns = [
    { header: "Student Name", accessor: "student" },
    {
      header: "Admission Number",
      accessor: "admissionNumber",
      className: "hidden md:table-cell",
    },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: AdmissionList) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td>{`${item.firstName} ${item.middleName} ${item.lastName}`}</td>
        <td>{item.admissionNumber}</td>
        <td>
          <div className="flex items-center gap-2">
            <FormContainer type="view" table="academicHistory" data={item} />
          </div>
        </td>
      </tr>
    );
  };

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  const whereClause: Prisma.AdmissionWhereInput = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { middleName: { contains: search, mode: "insensitive" } },
          { admissionNumber: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  // Fetch enrolled students
  const [data, count] = await prisma.$transaction([
    prisma.admission.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        admissionNumber: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.admission.count({ where: whereClause }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Admitted Students
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AcademicHistory;
