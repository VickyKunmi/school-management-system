import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma, Result } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
type ResultLists = {
  id: number;
  title: string;
  studentFirstName: string;
  studentMiddleName: string;
  studentLastName: string;
  teacherFirstName: string;
  teacherMiddleName: string;
  teacherLastName: string;
  score: number;
  classname: string;
  startTime: Date;
};
const ResultList = async ({
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
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },

    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
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

    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ResultLists) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>

      <td>
        {item.studentFirstName +
          " " +
          item.studentMiddleName +
          " " +
          item.studentLastName}
      </td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">
        {item.teacherFirstName +
          " " +
          item.teacherMiddleName +
          " " +
          item.teacherLastName}
      </td>
      <td className="hidden md:table-cell">{item.classname}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GH").format(item.startTime)}{" "}
      </td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teacher/${item.id}`}></Link>
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal type="update" table="result" data={item} />
              <FormModal type="delete" table="result" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;

            break;

          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              {
                student: {
                  firstName: { contains: value, mode: "insensitive" },
                  middleName: { contains: value, mode: "insensitive" },
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

  // role condition

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } },
      ];
      break;
    case "student":
      query.studentId = currentUserId!;
      break;
    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: {
          select: { firstName: true, middleName: true, lastName: true },
        },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: {
                  select: { firstName: true, middleName: true, lastName: true },
                },
              },
            },
          },
        },

        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: {
                  select: { firstName: true, middleName: true, lastName: true },
                },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataRes.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null;

    const isExam = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentFirstName: item.student.firstName,
      studentMiddleName: item.student.middleName,
      studentLastName: item.student.lastName,
      teacherFirstName: assessment.lesson.teacher.firstName,
      teacherMiddleName: assessment.lesson.teacher.middleName,
      teacherLastName: assessment.lesson.teacher.lastName,
      score: item.score,
      classname: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormModal type="create" table="result" />
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

export default ResultList;
