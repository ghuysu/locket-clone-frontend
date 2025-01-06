import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./pages/Auth";
import MainPage from "./pages/MainPage";
import Cookies from "js-cookie";
import IO from "socket.io-client";

const socket = IO(`${import.meta.env.VITE_API_URL}`);

function App() {
  const [firstLoad, setFirstLoad] = useState(true);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(JSON.parse(Cookies.get("user") || null));
  const [chat, setChat] = useState(JSON.parse(null));
  const [signInKey, setSignInKey] = useState(Cookies.get("signInKey") || null);
  const [expiryDay, setExpiryDay] = useState(Cookies.get("expiryDay") || null);
  const [error, setError] = useState(null);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [justSignIn, setJustSignIn] = useState(false);

  useEffect(() => {
    console.log({ error });
  }, [error]);

  useEffect(() => {
    if (auth && (!user || !chat || !signInKey || !expiryDay)) {
      signoutHandler();
    }
    //expiryday: 2024-08-17T04:14:26.302Z
    else if (auth && Date.now() > new Date(expiryDay).getTime()) {
      signoutHandler();
    }
  }, []);

  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), {
        expires: new Date(expiryDay),
        secure: true,
        sameSite: "Strict",
      });
    }
    if (signInKey) {
      Cookies.set("signInKey", signInKey, {
        expires: new Date(expiryDay),
        secure: true,
        sameSite: "Strict",
      });
    }
    if (expiryDay) {
      Cookies.set("expiryDay", expiryDay, {
        expires: new Date(expiryDay),
        secure: true,
        sameSite: "Strict",
      });
    }
  }, [user, signInKey, expiryDay]);

  useEffect(() => {
    if (user && signInKey && expiryDay) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [user, signInKey, expiryDay]);

  useEffect(() => {
    (async () => {
      if (firstLoad && auth) {
        const newUser = await getUserInfor();
        if (!newUser) return;
        setUser(newUser);
        setFirstLoad(false);
      }
      if (auth) {
        setIsLoadingChat(true);
        const newChat = await getChat();
        if (!newChat) return;
        setChat(newChat);
        setIsLoadingChat(false);
      }
    })();
  }, [auth]);

  useEffect(() => {
    (async () => {
      if (justSignIn && auth) {
        setIsLoadingChat(true);
        const newChat = await getChat();
        if (!newChat) return;
        setChat(newChat);
        setIsLoadingChat(false);
        setJustSignIn(false);
      }
    })();
  }, [auth, justSignIn]);

  useEffect(() => {
    if (chat && user) {
      const handleSocketEvent = async (data) => {
        //if don't load user and chat yet => cancel
        if (!user || !chat) return;
        console.log(data);
        //check action
        if (data.action === "sent") {
          const infor = data.data;
          //check user is receiver
          if (user._id !== infor.receiverId) return;
          //set new message from friend
          setChat((chat) => {
            return chat.map((friendChat) => {
              if (friendChat.friendId === infor.senderId) {
                friendChat.messages.push(infor.message);
              }
              return friendChat;
            });
          });
        } else {
          return;
        }
      };

      // Đăng ký sự kiện khi component mount
      socket.on("message", handleSocketEvent);

      // Hủy đăng ký sự kiện khi component unmount
      return () => {
        socket.off("message", handleSocketEvent);
      };
    }
  }, [chat, user]);

  useEffect(() => {
    if (user && signInKey) {
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
        } else if (data.action === "accept friend") {
          if (!data.userList.some((i) => i.toString() === user._id)) {
            return;
          }
        } else {
          return;
        }
        try {
          const gotUser = await getUserInfor();
          setUser(gotUser);
          if (data.action === "accept friend") {
            console.log("hehe");
            const gotChat = await getChat();
            setChat(gotChat);
          }
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
    }
  }, [user, signInKey]);

  const getUserInfor = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/search/user/${user._id}`,
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
      setError(error);
      return null;
    }
  };

  const getChat = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/message/all`,
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
      setError(error);
      return null;
    }
  };

  const signoutHandler = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/access/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "ABC-XYZ-WWW",
          authorization: signInKey,
          "user-id": user?._id,
        },
      });
      Cookies.remove("user");
      Cookies.remove("signInKey");
      Cookies.remove("expiryDay");
      setSignInKey(null);
      setExpiryDay(null);
      setUser(null);
      setChat(null);
      setError(null);
      setAuth(false);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      {auth ? (
        <MainPage
          user={user}
          setUser={setUser}
          signInKey={signInKey}
          signoutHandler={signoutHandler}
          chat={chat}
          setChat={setChat}
          isLoadingChat={isLoadingChat}
        />
      ) : (
        <Auth
          setUser={setUser}
          setSignInKey={setSignInKey}
          setExpiryDay={setExpiryDay}
          setJustSignIn={setJustSignIn}
        />
      )}
    </div>
  );
}

export default App;
