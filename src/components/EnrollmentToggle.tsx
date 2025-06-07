"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const EnrollmentToggle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the current showEnrolled state from URL
  const showEnrolled = searchParams.get("showEnrolled") !== "false"; // Default to true
  console.log("showEnrolled:", showEnrolled);


  const toggleEnrolled = () => {
    const newShowEnrolled = !showEnrolled;
    const params = new URLSearchParams(searchParams);
    params.set("showEnrolled", newShowEnrolled.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <button
      onClick={toggleEnrolled}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-lightGreen"
    >
      <Image src="/sort.png" alt="Toggle" width={14} height={14} />
    </button>
  );
};

export default EnrollmentToggle;
