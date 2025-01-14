import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Attendance, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PresencelogLists = Attendance & { 
    student: { firstName: string; lastName: string }; // Student info
    lesson: { name: string }; // Lesson info
 };

const PresencelogList = async ({
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
      header: "Date",
      accessor: "date",
    },
    {
      header: "Student name",
      accessor: "student",
    },
    {
      header: "Lesson",
      accessor: "lesson",
    },
    {
      header: "Status",
      accessor: "status",
    },
    ...(role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: PresencelogLists) => (
    
    
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      
      <td>{new Date(item.date).toLocaleDateString()}</td>
      <td>{item.student.firstName} {item.student.lastName}</td>
      <td>{item.lesson.name}</td>
      <td>{item.status}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teacher/${item.id}`}></Link>
          {role === "teacher" && (
            <>
              <FormContainer type="update" table="presencelog" data={item} />
              <FormContainer type="delete" table="presencelog" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;
  const query: Prisma.AttendanceWhereInput = {};

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
              { lesson: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }


  // role condition


  switch(role) {
    case "admin": 
    break;
    case "teacher": 
    query.OR = [
        {lesson: {teacherId: currentUserId!}}
    ];
    break;
    case "student": 
    query.studentId = currentUserId!;
    break;

    case "parent": 
    query.student = {
        parentId: currentUserId!,
    }
    break;
    default:
    break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
        lesson: {
          select: { id: true, name: true },
        },
      },

      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({
      where: query,
    }),
  ]);


  

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Presence Logs
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
            {role === "teacher" && (
              <FormContainer type="create" table="presencelog" />
            )}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />

      <Pagination page={p} count={count} />
    </div>
  );
};

export default PresencelogList;
