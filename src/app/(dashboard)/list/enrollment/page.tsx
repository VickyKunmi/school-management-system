import React from "react";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Prisma, Enrollment, Admission } from "@prisma/client";
import Image from "next/image";
import EnrollmentToggle from "@/components/EnrollmentToggle";

type EnrollmentLists = Enrollment & { class: Class; admission: Admission };

const EnrollmentList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const showEnrolled = searchParams.showEnrolled !== "false"; // Default to true if not set

  const columns = showEnrolled
    ? [
        {
          header: "Image",
          accessor: "img",
        },
        {
          header: "Admission NO",
          accessor: "admissionNumber",
        },
        {
          header: "Name",
          accessor: "name",
          className: "hidden md:table-cell",
        },
        {
          header: "Academic Year",
          accessor: "academicYear",
          className: "hidden md:table-cell",
        },
        {
          header: "Term",
          accessor: "term",
          className: "hidden md:table-cell",
        },
        {
          header: "Status",
          accessor: "status",
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
      ]
    : [
        {
          header: "Image",
          accessor: "img",
        },
        {
          header: "Name",
          accessor: "name",
        },
        {
          header: "Admisison No",
          accessor: "admisisonNo",
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

  const renderRow = (item: EnrollmentLists | Admission) => {
    const isEnrolled = "admission" in item;

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        {isEnrolled ? (
          <>
            <td className="flex items-center gap-4 p-4">
              <Image
                src={item.admission.img}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </td>
            <td className="hidden md:table-cell">
              {item.admission.admissionNumber}
            </td>
            <td>
              <h3 className="font-semibold">
                {`${item.admission.firstName} ${
                  item.admission.middleName || ""
                } ${item.admission.lastName}`}
              </h3>
            </td>
            <td className="hidden md:table-cell">{item.academicYear}</td>
            <td className="hidden md:table-cell">{item.term}</td>
            <td className="hidden md:table-cell">{item.status}</td>

            {role === "admin" && (
              <td>
                <div className="flex items-center gap-2">
                  <FormContainer type="update" table="enrollment" data={item} />
                </div>
              </td>
            )}
          </>
        ) : (
          <>
            <td className="flex items-center gap-4 p-4">
              <Image
                src={item.img}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </td>
            <td>
              <h3 className="font-semibold">
                {`${item.firstName} ${item.middleName || ""} ${item.lastName}`}
              </h3>
            </td>

            <td>{item.admissionNumber}</td>

            {role === "admin" && (
              <td>
                <div className="flex items-center gap-2">
                  <FormContainer type="create" table="enrollment" data={item} />
                </div>
              </td>
            )}
          </>
        )}
      </tr>
    );
  };

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const systemSettings = await prisma.settings.findFirst();

  const currentAcademicYear = systemSettings?.academicYear;
  const currentTerm = systemSettings?.term;

  const query: Prisma.AdmissionWhereInput = {
    AND: [
      {
        enrollments: {
          none: {
            academicYear: currentAcademicYear,
            term: currentTerm,
          },
        },
      },
    ],
  };

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

  console.log("query: ", query);

  let data, count;
  const currentSettings = await prisma.settings.findFirst({
    orderBy: { updatedAt: "desc" }, // Get the latest settings entry
  });

  if (showEnrolled) {
    // Query enrollment records for enrolled students
    [data, count] = await prisma.$transaction([
      prisma.enrollment.findMany({
        where: {
          academicYear: currentAcademicYear,
          term: currentTerm,
          admission: {
            enrollments: {
              some: { academicYear: currentAcademicYear, term: currentTerm },
            },
          },
        },
        include: {
          admission: true,
          class: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.enrollment.count({
        where: {
          admission: {
            enrollments: {
              some: { academicYear: currentAcademicYear, term: currentTerm },
            },
          },
        },
      }),
    ]);
  } else {
    // Query admission records for not-enrolled students
    [data, count] = await prisma.$transaction([
      prisma.admission.findMany({
        where: {
          enrollments: {
            none: { academicYear: currentAcademicYear, term: currentTerm },
          },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.admission.count({
        where: {
          enrollments: {
            none: { academicYear: currentAcademicYear, term: currentTerm },
          },
        },
      }),
    ]);
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {showEnrolled ? "Enrolled Students" : "Not Enrolled Students"}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <EnrollmentToggle />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        renderRow={renderRow}
        data={data}
        key={showEnrolled ? "enrolled" : "not-enrolled"}
      />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EnrollmentList;
