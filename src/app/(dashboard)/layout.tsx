import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]  p-4 bg-[#2e7d32] ">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 lg:justify-start"
        >
          <Image src="/slogo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold">Great Tess</span>
        </Link>
        <Menu />
      </div>

      {/* Rigth */}
      {/* <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]  overflow-scroll"> */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#f5f4f4] overflow-scroll  flex flex-col">

        <Navbar />
        {children}
      </div>
    </div>
  );
}
