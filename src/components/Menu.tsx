

import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "staff"],
      },
      {
        icon: "/settings.png",
        label: "Settings",
        href: "/list/settings",
        visible: ["admin"],
      },
      {
        icon: "/staff.png",
        label: "Staff",
        href: "/list/employee",
        visible: ["admin"],
      },
      {
        icon: "/admission.png",
        label: "Admit Student",
        href: "/list/students",
        visible: ["admin"],
      },
      {
        icon: "/enroll.png",
        label: "Enroll Student",
        href: "/list/enrollment",
        visible: ["admin"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/grade.png",
        label: "Grade",
        href: "/list/grades",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin"],
      },

      {
        icon: "/result.png",
        label: "Academic History",
        href: "/list/academichistory",
        visible: ["admin"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin"],
      },
      {
        icon: "/payroll.png",
        label: "Staff payroll",
        href: "/list/payroll",
        visible: ["admin"],
      },
     
    ],
  },
  
];

const Menu = async () => {
  const user = await currentUser();

  
  
  const role = user?.publicMetadata.role as string;
 
  // console.log("User:", user);
  // console.log("Role:", role);
  

  return (
    <div className="mt-4 text-sm ">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-white font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role) && item.href) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 font-bold rounded-md hover:bg-yellow hover:text-black"
                >
                  <Image src={item.icon} width={20} height={20} alt="" style={{color: "white"}} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
