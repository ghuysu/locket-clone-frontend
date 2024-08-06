import React from "react";

const ProfileBar = ({ user }) => {
  return (
    <div className="flex flex-row items-center justify-between space-x-10 bg-black sm:w-[420px] md:w-[700px] lg:w-[930px] h-[60px] pr-[10px] rounded-[60px] shadow-lg shadow-yellow-500">
      <div className="flex items-center">
        <div className="ml-2 border-[1px] border-yellow-500 rounded-full">
          <img src={user.profileImageUrl} className="rounded-full w-8 m-1" />
        </div>
        <p className="bold text-sm text-gray ml-2">{`${user.fullname.firstname} ${user.fullname.lastname}`}</p>
      </div>
      <div className="flex flex-col p-5 space-y-1 justify-center h-8 w-50 bg-yellow-500 bg-opacity-90 rounded-[30px]">
        <div className="flex items-center justify-start">
          <img className="w-4 mr-2" src={"/public/assets/images/email.png"} />
          <p className="text-zinc-900 semibold text-[10px]">{user.email}</p>
        </div>
        <div className="flex items-center justify-start">
          <img
            className="w-4 mr-2"
            src={"/public/assets/images/birthday.png"}
          />
          <p className="text-zinc-900 semibold text-[10px] mt-1">
            {user.birthday}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBar;
