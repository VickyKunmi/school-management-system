
"use client";

import { useState } from "react";
import PayrollView from "./forms/PayrollView";
import Modal from "./Modal"; 
import Image from "next/image";

type PayrollViewToggleProps = {
  employeeId: string;
};

export default function PayrollViewToggle({ employeeId }: PayrollViewToggleProps) {
  const [open, setOpen] = useState(false);
  const size = "w-8 h-8";
  const bgColor = "bg-deepGreen"


  return (
    <>
       <button
              className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
              onClick={() => setOpen(true)}
            >
              <Image src={"/view.png"} alt="" width={16} height={16} />
            </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <PayrollView employeeId={employeeId} />
        </Modal>
      )}
    </>
  );
}
