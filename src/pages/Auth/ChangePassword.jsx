import { useState, useRef, useEffect } from "react";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import gsap from "gsap";

const validatePassword = (password) => {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/;
  return regex.test(password);
};

const ChangePassword = ({ verifiedEmail, handleBackClick }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [isSuccessfully, setIsSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });
  }, []);

  const checkValid = () => {
    if (validatePassword(password) && password === confirmPassword) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkValid();
  }, [password, confirmPassword]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleClick = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/access/password`,
        {
          method: "PATCH",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: verifiedEmail,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.message === "API key is required") {
          setError("API key is required.");
        } else if (data.message === "API key is incorrect") {
          setError("API key is incorrect.");
        } else if (data.message === "Email and password are required") {
          setError("Email and password are required.");
        } else if (data.message === "New password does not meet requirements") {
          setError("Your password does not meet requirements.");
        } else {
          setError("An unknown error occurred.");
        }
        setIsSuccessfully(false);
      } else {
        setIsSuccessfully(true);
        setTimeout(() => {
          handleBackClick();
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black flex flex-col w-full pt-10 border-t-4 border-yellow-500 rounded-lg">
      <Logo />
      <div
        ref={contentRef}
        className="pt-28 flex flex-col items-center justify-center"
      >
        <p className="bold text-2xl pb-7 text-gray">
          Let's change your password!
        </p>
        <div className="mt-4">
          <p className="text-left text-gray text-sm ml-2 pb-1">Password</p>
          <PasswordInput
            text={"Password"}
            handleChange={handlePasswordChange}
            name={"password"}
            value={password}
          />
        </div>
        <div className="mt-4">
          <p className="text-left text-gray text-sm ml-2 pb-1">
            Confirm password
          </p>
          <PasswordInput
            text={"Confirm password"}
            handleChange={handleConfirmPasswordChange}
            name={"confirmPassword"}
            value={confirmPassword}
          />
        </div>
        <p className="pt-3 text-xs text-zinc-600 pb-10">
          Your password must have at least 8 characters, including <br />
          <span className="text-zinc-400">special characters</span>,{" "}
          <span className="text-zinc-400">capital letters</span>, and{" "}
          <span className="text-zinc-400">number</span>
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            text={isLoading ? "Sending..." : "Change your password"}
            handleClick={!isLoading && isValid ? handleClick : () => {}}
            isActive={!isLoading && isValid}
          />
          <Button text={"Back"} handleClick={handleBackClick} isActive={true} />
        </div>
        {error.length !== 0 && <p className="text-red-500 pt-4">{error}</p>}
        {isSuccessfully && (
          <p className="text-green-500 text-base pt-4">
            Change password successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
