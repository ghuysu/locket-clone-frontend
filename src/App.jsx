import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./pages/Auth";
import MainPage from "./pages/MainPage";
import Cookies from "js-cookie";
import IO from "socket.io-client";

const socket = IO("https://skn7vgp9-9876.asse.devtunnels.ms");

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [signInKey, setSignInKey] = useState(Cookies.get("signInKey") || "");
  const [expiryDay, setExpiryDay] = useState(Cookies.get("expiryDay") || "");

  useEffect(() => {
    const handleSocketEvent = async (data) => {
      if (!user) return;
      console.log(data);
      if (data.action === "friend") {
        if (data.userId !== user._id) {
          return;
        }
      } else if (data.action === "user") {
        if (!data.userList.some((i) => i.toString() === user._id)) {
          return;
        }
      } else {
        return;
      }
      try {
        const response = await fetch(
          `https://skn7vgp9-9876.asse.devtunnels.ms/search/user/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "api-key": "ABC-XYZ-WWW",
              authorization: signInKey,
              "user-id": user?._id,
            },
          }
        );
        const data = await response.json();
        console.log({ update: data });
        setUser(data.metadata);
      } catch (error) {
        console.log(error);
      }
    };

    // Đăng ký sự kiện khi component mount
    socket.on("user", handleSocketEvent);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      socket.off("user", handleSocketEvent);
    };
  }, [user, signInKey]);

  const getUserInfor = async () => {
    try {
      const response = await fetch(
        `https://skn7vgp9-9876.asse.devtunnels.ms/search/user/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data.metadata;
    } catch (error) {
      signoutHandler();
      return null;
    }
  };

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error("Failed to parse user data from cookie:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (signInKey) {
      Cookies.set("signInKey", signInKey, {
        expires: new Date(expiryDay),
        secure: true,
        sameSite: "Strict",
      });
    } else {
      Cookies.remove("signInKey");
    }
  }, [signInKey]);

  useEffect(() => {
    if (expiryDay) {
      Cookies.set("expiryDay", expiryDay, {
        expires: new Date(expiryDay),
        secure: true,
        sameSite: "Strict",
      });
    } else {
      Cookies.remove("expiryDay");
    }
  }, [expiryDay]);

  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), {
        expires: new Date(expiryDay),
        secure: true,
        sameSite: "Strict",
      });
    } else {
      Cookies.remove("user");
    }
  }, [user]);

  const signoutHandler = async () => {
    try {
      await fetch("https://skn7vgp9-9876.asse.devtunnels.ms/access/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "ABC-XYZ-WWW",
          authorization: signInKey,
          "user-id": user?._id,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("user");
      Cookies.remove("signInKey");
      Cookies.remove("expiryDay");
      setSignInKey("");
      setExpiryDay("");
      setUser(null);
      setAuth(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const currentExpiryDay = Cookies.get("expiryDay");
      if (currentExpiryDay) {
        const expiryDate = new Date(currentExpiryDay);
        if (Date.now() > expiryDate.getTime()) {
          signoutHandler();
        } else {
          setAuth(true);
        }
      } else {
        setAuth(false);
      }
    };

    checkAuth();
  }, [signInKey, expiryDay]);

  useEffect(() => {
    if (auth && user && signInKey) {
      (async () => {
        const userInfo = await getUserInfor();
        setUser(userInfo);
      })();
    }
  }, []);

  return (
    <div>
      {auth && user ? (
        <MainPage
          user={user}
          setUser={setUser}
          signInKey={signInKey}
          signoutHandler={signoutHandler}
        />
      ) : (
        <Auth
          setUser={setUser}
          setSignInKey={setSignInKey}
          setExpiryDay={setExpiryDay}
        />
      )}
    </div>
  );
}

export default App;
