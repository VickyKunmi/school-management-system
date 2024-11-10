// src/components/BirthdayCelebration.tsx

"use client";

import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

const BirthdayCelebration = ({
  user,
}: {
  user: { firstName: string; birthday: Date };
}) => {
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const today = new Date();
    if (
      today.getDate() === user.birthday.getDate() &&
      today.getMonth() === user.birthday.getMonth()
    ) {
      setIsBirthday(true);
    }
  }, [user.birthday]);

  if (!isBirthday) return null;

  return (
    <>
      <ReactConfetti />
      <div className="bg-yellow-100 text-center p-4 rounded-md mb-4">
        <h2 className="text-2xl font-bold">
          Happy Birthday, {user.firstName}!
        </h2>
        <p>🎉 Wishing you a fantastic day! 🎉</p>
      </div>
    </>
  );
};

export default BirthdayCelebration;
