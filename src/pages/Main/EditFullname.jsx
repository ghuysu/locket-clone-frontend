import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import gsap from "gsap";

const EditFullname = ({ user, signInKey, setUser }) => {
  const [firstname, setFirstname] = useState(user.fullname.firstname);
  const [lastname, setLastname] = useState(user.fullname.lastname);
  const [valid, setValid] = useState(false);
  const [processing, setProcessing] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  useEffect(() => {
    const oldFullname = `${user.fullname.firstname} ${user.fullname.lastname}`;
    const newFullname = `${firstname} ${lastname}`;
    if (
      firstname.length !== 0 &&
      lastname.length !== 0 &&
      newFullname !== oldFullname
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [firstname, lastname, user]);

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleClick = async () => {
    setProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/name`,
        {
          method: "PATCH",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            "Content-Type": "application/json",
            authorization: signInKey,
            "user-id": user?._id,
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
          }),
        }
      );
      const data = await response.json();
      setUser(data.metadata);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-transparent"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        ref={contentRef}
        className="bg-black w-[500px] h-[400px] p-8 rounded-3xl shadow-2xl border-t-4 border-yellow-500 flex flex-col justify-center items-center"
      >
        <p className="text-3xl text-yellow-500 bold pb-20">
          What is your new name?
        </p>
        <div>
          <Input
            text={"Firstname"}
            handleChange={handleFirstnameChange}
            value={firstname}
            name={"firstname"}
          />
          <div className="pb-3"></div>
          <Input
            text={"Lastname"}
            handleChange={handleLastnameChange}
            value={lastname}
            name={"lastname"}
          />
          <div className="pb-4"></div>
          <Button
            isActive={!processing && valid}
            text={processing ? "Processing..." : "Save your name"}
            handleClick={!processing && valid ? handleClick : () => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default EditFullname;
