import React from "react";

const NumberNotification = ({ number }) => {
  return (
    <div className="rounded-full w-4 h-4 bg-red-500 p-1 flex items-center justify-center">
      <p className="text-white text-[8px]">{number}</p>
    </div>
  );
};

export default NumberNotification;
