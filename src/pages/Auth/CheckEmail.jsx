import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import Input from "../../components/Input";

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

function Email({ setCode, handleBackClick, setEmail, email }) {
  const [isCorrectFormatEmail, setIsCorrectFormatEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(""); // Để lưu thông báo lỗi

  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/access/check-email`,
        {
          method: "POST",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // Xử lý các mã lỗi cụ thể
        if (data.message === "API key is required") {
          setError("API key is required.");
        } else if (data.message === "API key is incorrect") {
          setError("API key is incorrect.");
        } else if (data.message === "Email is registered") {
          setError("Email is already registered.");
        } else if (data.message === "Email is invalid") {
          setError("Email format is invalid.");
        } else {
          setError("An unknown error occurred.");
        }
      } else {
        setCode(data.metadata.code);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const email = event.target.value;
    setEmail(email);
    setIsCorrectFormatEmail(isValidEmail(email));
  };

  return (
    <div className="bg-black flex flex-col w-full pt-10 border-t-4 border-yellow-500 rounded-lg">
      <Logo />
      <div
        ref={contentRef}
        className="pt-40 flex flex-col items-center justify-center"
      >
        <p className="bold text-2xl pb-7 text-gray">What's your email?</p>
        <Input
          text={"Email address"}
          handleChange={handleChange}
          name={"email"}
          value={email}
        />
        <p className="pt-20 text-xs text-zinc-600 pb-3">
          By clicking the button below, you are agreeing to our
          <br />
          <span className="text-zinc-400">Terms of Service</span> and{" "}
          <span className="text-zinc-400">Privacy Policy</span>
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            text={isLoading ? "Sending..." : "Send code to your email"}
            handleClick={
              !isLoading && isCorrectFormatEmail ? handleClick : () => {}
            }
            isActive={!isLoading && isCorrectFormatEmail}
          />
          <Button text={"Back"} handleClick={handleBackClick} isActive={true} />
        </div>
        {error && <p className="text-red-500 pt-4">{error}</p>}
      </div>
    </div>
  );
}

function Code({ code, setAuth, setCode, email, setVerifiedEmail }) {
  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState(""); // Để lưu thông báo lỗi

  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });
  }, []);

  const handleClick = async () => {
    setError("");
    if (enteredCode !== code.toString()) {
      setError("Your code is incorrect.");
    } else {
      setVerifiedEmail(email);
      if (setAuth) setAuth(true);
    }
  };

  const handleChange = (event) => {
    const code = event.target.value;
    setEnteredCode(code);
  };

  const handleBackClick = () => {
    setCode(null);
  };

  return (
    <div className="bg-black flex flex-col w-full pt-10 border-t-4 border-yellow-500 rounded-lg">
      <Logo />
      <div
        ref={contentRef}
        className="pt-40 flex flex-col items-center justify-center"
      >
        <p className="bold text-2xl pb-7 text-gray">
          What's your received code?
        </p>
        <Input
          text={"Verify code"}
          handleChange={handleChange}
          name={"code"}
          value={enteredCode}
        />
        <p className="pt-20 text-xs text-zinc-600 pb-3">
          We sent an verify code to your email, please check your email!
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            text={"Verify code"}
            handleClick={handleClick}
            isActive={enteredCode.length === 0 ? false : true}
          />
          <Button text={"Back"} handleClick={handleBackClick} isActive={true} />
        </div>
        {error && <p className="text-red-500 pt-4">{error}</p>}
      </div>
    </div>
  );
}

export default function CheckEmail({
  handleBackClick,
  setAuth,
  setVerifiedEmail,
}) {
  const [code, setCode] = useState(null);
  const [email, setEmail] = useState("");
  return (
    <div>
      {code ? (
        <Code
          email={email}
          setVerifiedEmail={setVerifiedEmail}
          code={code}
          setCode={setCode}
          setAuth={setAuth}
        />
      ) : (
        <Email
          setEmail={setEmail}
          email={email}
          handleBackClick={handleBackClick}
          setCode={setCode}
        />
      )}
    </div>
  );
}
