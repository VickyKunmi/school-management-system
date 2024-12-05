

"use client";

import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

interface User {
  firstName: string;
  birthday: Date;
}

const BirthdayCelebration = ({ user }: { user: User }) => {
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const today = new Date();
    const birthday = new Date(user.birthday); 
    if (
      today.getDate() === birthday.getDate() &&
      today.getMonth() === birthday.getMonth()
    ) {
      setIsBirthday(true);
    }
  }, [user]);

  if (!isBirthday) return null;

  return (
    <>
      <ReactConfetti />
      <div className="bg-yellow-100 text-center p-4 rounded-md mb-4">
        <h2 className="text-2xl font-bold">Happy Birthday, {user.firstName}!</h2>
        <p>🎉 Wishing you a fantastic day! 🎉</p>
      </div>
    </>
  );
};

export default BirthdayCelebration;
