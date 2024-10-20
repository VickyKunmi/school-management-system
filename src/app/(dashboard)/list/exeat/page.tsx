import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { examsData, exeatRequestData, leaveRequestData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Exeat = {
  id: number;
  appliedDate: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
};
const columns = [
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

  {
    header: "Actions",
    accessor: "action",
  },
];

const ExeatList = () => {
  const renderRow = (item: Exeat) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.appliedDate}</td>
      <td>{item.startDate}</td>
      <td className="hidden md:table-cell">{item.endDate}</td>
      <td className="hidden md:table-cell">{item.type}</td>
      <td className="hidden md:table-cell">{item.status}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teacher/${item.id}`}></Link>
          {role === "admin" && (
            <FormModal type="update" table="exam" data={item} />
          )}
          {role === "student" && (
            <Link href={`/list/teacher/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow">
                <Image src="/view.png" alt="" width={16} height={16} />
              </button>
            </Link>
          )}
        </div>
      </td>
    </tr>
  );

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
            {role === "student" && <FormModal type="create" table="exeat" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={exeatRequestData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ExeatList;
