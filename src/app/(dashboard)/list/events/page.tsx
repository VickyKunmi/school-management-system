import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type EventLists = Event & { class: Class };

const EventList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const authObject = await auth();
  const { userId, sessionClaims } = authObject;
  const currentUserId = userId;
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
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

  const renderRow = (item: EventLists) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>

      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GH").format(item.startTime)}{" "}
      </td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString("en-GH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString("en-GH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teacher/${item.id}`}></Link>
          {role === "admin" && (
            <>
              <FormModal type="update" table="event" data={item} />
              <FormModal type="delete" table="event" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.EventWhereInput = {};

  // Handle URL Params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }
  
  // Role conditions for teacher, student, or parent
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };
  


  query.OR = [
    { classId: null },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];
  
  
  // Fetch the events
  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({
      where: query,
    }),
  ]);
  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal type="create" table="event" />}
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

export default EventList;
