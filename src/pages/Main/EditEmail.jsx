import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Button from "../../components/Button";
import Logo from "../../components/Logo";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";

function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(String(email).toLowerCase());
}

function Email({ oldEmail, setCode, setNewEmail, setPage, signInKey, userId }) {
  const [isValid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(oldEmail);
  const [password, setPassword] = useState("");

  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  const handleClick = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/account/email`,
        {
          method: "POST",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            "Content-Type": "application/json",
            "user-id": userId,
            authorization: signInKey,
          },
          body: JSON.stringify({
            oldEmail: oldEmail,
            newEmail: email,
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
        } else if (data.message === "Infor is required") {
          setError("Infor is required.");
        } else if (data.message === "Old email is not registered") {
          setError("Old email is not registered.");
        } else if (data.message === "Password is incorrect") {
          setError("Password is incorrect.");
        } else if (data.message === "Email is registered") {
          setError("Email is already registered by another user.");
        } else {
          setError("An unknown error occurred.");
        }
      } else {
        setCode(data.metadata.code);
        setNewEmail(email);
        setPage("code");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (isValidEmail(email) && email !== oldEmail && password.length >= 8) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [email, password]);

  return (
    <div
      className="flex items-center justify-center bg-transparent"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        ref={contentRef}
        className="bg-black w-[500px] h-[400px] p-8 rounded-3xl shadow-2xl border-t-4 border-yellow-500 flex flex-col justify-center items-center"
      >
        <p className="bold text-2xl pb-7 text-yellow-500">
          What is your new email?
        </p>
        <Input
          text={"Email address"}
          handleChange={handleEmailChange}
          name={"email"}
          value={email}
        />
        <div className="pb-3"></div>
        <PasswordInput
          text={"Your password"}
          handleChange={handlePasswordChange}
          name={"password"}
          value={password}
        />
        <div className="flex flex-col justify-center space-x-4 pt-8">
          <p className="text-xs text-zinc-500 pb-2">
            Enter your new email along with your password <br></br> correctly to
            be processed
          </p>
          <Button
            text={isLoading ? "Processing..." : "Send code to your new email"}
            handleClick={!isLoading && isValid ? handleClick : () => {}}
            isActive={!isLoading && isValid}
          />
        </div>
        {error && <p className="text-xs text-red-500 pt-4">{error}</p>}
      </div>
    </div>
  );
}

function Code({ setPage, email, code, setUser, signInKey, userId }) {
  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  const handleClick = async () => {
    setError("");
    if (enteredCode !== code.toString()) {
      setError("Your code is incorrect.");
    } else {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/account/confirm-email`,
          {
            method: "PATCH",
            headers: {
              "api-key": "ABC-XYZ-WWW",
              "Content-Type": "application/json",
              "user-id": userId,
              authorization: signInKey,
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setError("An unknown error occurred.");
        } else {
          setUser(data.metadata);
          setPage("email");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to send code. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event) => {
    const code = event.target.value;
    setEnteredCode(code);
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
        <p className="bold text-2xl pb-7 text-yellow-500">
          What's your received code?
        </p>
        <Input
          text={"Verify code"}
          handleChange={handleChange}
          name={"code"}
          value={enteredCode}
        />
        <p className="pt-2 text-xs text-zinc-600 pb-3">
          We sent an verify code to your new email, please check it!
        </p>
        <div className="pt-8 flex justify-center space-x-4">
          <Button
            text={isLoading ? "Processing..." : "Verify code"}
            handleClick={
              !isLoading && enteredCode.length !== 0 ? handleClick : () => {}
            }
            isActive={!isLoading && enteredCode.length !== 0 ? true : false}
          />
        </div>
        {error && <p className="text-xs text-red-500 pt-4">{error}</p>}
      </div>
    </div>
  );
}

export default function EditEmail({ user, setUser, signInKey }) {
  const [code, setCode] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [page, setPage] = useState("email");

  return (
    <div>
      {page === "code" ? (
        <Code
          setPage={setPage}
          email={newEmail}
          code={code}
          setUser={setUser}
          signInKey={signInKey}
          userId={user._id}
        />
      ) : (
        <Email
          oldEmail={user.email}
          setCode={setCode}
          setNewEmail={setNewEmail}
          setPage={setPage}
          signInKey={signInKey}
          userId={user._id}
        />
      )}
    </div>
  );
}
