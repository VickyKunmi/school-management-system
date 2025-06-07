import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

type EnrollmentList = {
  id: number;
  academicYear: string;
  term: string;
  admission: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    admissionNumber: string;
  };
  class: {
    name: string;
  };
  results: Array<{
    academicYear: string;
    term: string;
    subject: {
      id: number;
      name: string;
    };
  }>;
};

const ResultList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const columns = [
    { header: "Student Name", accessor: "student" },
    {
      header: "Academic Year",
      accessor: "academicYear",
      className: "hidden md:table-cell",
    },
    { header: "Term", accessor: "term", className: "hidden md:table-cell" },
    { header: "Class", accessor: "class", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  // const renderRow = (item: EnrollmentList) => (

  //   <tr
  //     key={item.id}
  //     className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  //   >
  //     <td>{item.admission.firstName + " " + item.admission.lastName}</td>
  //     <td>{item.academicYear}</td>
  //     <td className="hidden md:table-cell">{item.term}</td>
  //     <td className="hidden md:table-cell">{item.class.name}</td>
  //     <td>
  //       <div className="flex items-center gap-2">
  //         {/* Button to enter results */}
  //         <FormContainer type="update" table="result" data={item} />
  //         <FormContainer
  //           type="create"
  //           table="result"
  //           data={{
  //             enrollmentId: item.id,
  //             academicYear: item.academicYear,
  //             term: item.term,
  //           }}
  //         />
  //       </div>
  //     </td>
  //   </tr>
  // );

  const renderRow = (item: EnrollmentList) => {
    // Check if there is any result that matches the enrollment's academic year and term.
    const hasResult = item.results?.some(
      (result) =>
        result.academicYear === item.academicYear && result.term === item.term
    );

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td>{`${item.admission.firstName} ${item.admission.middleName} ${item.admission.lastName}`}</td>
        <td>{item.academicYear}</td>
        <td className="hidden md:table-cell">{item.term}</td>
        <td className="hidden md:table-cell">{item.class.name}</td>
        <td>
          <div className="flex items-center gap-2">
            {hasResult ? (
              // If a result exists, show the update button.
              <FormContainer type="update" table="result" data={item} />
            ) : (
              // Otherwise, show the create button.
              <FormContainer
                type="create"
                table="result"
                data={{
                  enrollmentId: item.id,
                  academicYear: item.academicYear,
                  term: item.term,
                }}
              />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Fetch enrolled students
  const [data, count] = await prisma.$transaction([
    prisma.enrollment.findMany({
      include: {
        admission: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            admissionNumber: true,
          },
        },
        class: { select: { name: true } },
        results: {
          include: {
            subject: { select: { id: true, name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.enrollment.count(),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Enrolled Students
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

export default ResultList;
