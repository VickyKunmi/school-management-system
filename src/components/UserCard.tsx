import prisma from "@/lib/prisma";
import Image from "next/image";
import { any } from "zod";

const UserCard = async ({
  type,
}: {
  type:  | "employee" | "admission" | "enrollment";
}) => {
  const modelMap: Record<typeof type, any> = {
    // admin: prisma.admin,
    employee: prisma.employee,
    admission: prisma.admission,
    enrollment: prisma.enrollment,
  };

  const data = await modelMap[type].count();
 

  return (
    <div className="rounded-2xl bg-yellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-deepGreen">
          2024/2025
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-black">{type}</h2>
    </div>
  );
};

export default UserCard;
