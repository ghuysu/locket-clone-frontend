import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import Main from "./Main/Main";
import EditFullname from "./Main/EditFullname";
import EditEmail from "./Main/EditEmail";
import EditAvatar from "./Main/EditAvatar";
import EditBirthday from "./Main/EditBirthday";
import UserProfile from "./Main/UserProfile";
import DeleteAccount from "./Main/DeleteAccount";
import Search from "./Main/Search";
import Chat from "./Main/Chat";
import ChatButton from "../components/ChatButton";

const MainPage = ({
  user,
  setUser,
  signInKey,
  signoutHandler,
  chat,
  setChat,
  isLoadingChat,
}) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("main");
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchedKey, setSearchedKey] = useState("");
  const [numberOfNewMessages, setNumberOfNewMessages] = useState(0);

  const signout = async () => {
    setLoading(true);
    await signoutHandler();
    setLoading(false);
  };

  const unSeenMessage = useCallback((friendChat) => {
    return friendChat.messages.some(
      (message) => message.isRead === false && message.receiver._id === user._id
    );
  }, []);

  useEffect(() => {
    if (!chat) return;
    let count = 0;
    chat.forEach((friendChat) => {
      if (unSeenMessage(friendChat)) count++;
    });
    setNumberOfNewMessages(count);
  }, [chat]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchKey) return;
      setLoading(true);
      const key = searchKey.replace(/ /g, "%20");
      try {
        const response = await fetch(`http://localhost:9876/search/${key}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
        });

        const data = await response.json();

        if (response.status === 200) {
          setSearchedKey(searchKey);
          setSearchKey("");
          setSearchResult(data.metadata);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
      setPage("search");
    };

    fetchSearchResults();
  }, [searchKey]);

  return (
    <div className="bg-zinc-900 w-full h-svh relative flex justify-end flex-col items-center">
      {page !== "chat" && (
        <div className="absolute top-24 right-4 z-30">
          <ChatButton
            clickHandler={() => setPage("chat")}
            isLoadingChat={isLoadingChat}
            numberOfNewMessage={numberOfNewMessages}
          />
        </div>
      )}
      <Navbar
        user={user}
        setPage={setPage}
        signoutHandler={signout}
        setSearchKey={setSearchKey}
      />
      {page === "main" && (
        <Main
          user={user}
          signInKey={signInKey}
          setUser={setUser}
          signout={signout}
          setChat={setChat}
        />
      )}
      {page === "chat" && (
        <Chat
          user={user}
          signInKey={signInKey}
          setUser={setUser}
          chat={chat}
          setChat={setChat}
        />
      )}
      {page === "profile" && (
        <UserProfile
          user={user}
          signInKey={signInKey}
          setUser={setUser}
          setLoading={setLoading}
        />
      )}
      {page === "edit-fullname" && (
        <EditFullname user={user} signInKey={signInKey} setUser={setUser} />
      )}
      {page === "edit-email" && (
        <EditEmail user={user} signInKey={signInKey} setUser={setUser} />
      )}
      {page === "edit-birthday" && (
        <EditBirthday user={user} signInKey={signInKey} setUser={setUser} />
      )}
      {page === "edit-avatar" && (
        <EditAvatar user={user} signInKey={signInKey} setUser={setUser} />
      )}
      {page === "delete" && (
        <DeleteAccount signout={signout} user={user} signInKey={signInKey} />
      )}
      {page === "search" && (
        <Search
          setLoading={setLoading}
          searchKey={searchedKey}
          searchResult={searchResult}
          user={user}
          setUser={setUser}
          signInKey={signInKey}
        />
      )}
      {loading && <Loading />}
    </div>
  );
};

export default MainPage;
