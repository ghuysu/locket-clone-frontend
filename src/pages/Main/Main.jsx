import React, { useState, useEffect, useRef } from "react";
import FriendSelection from "../../components/FriendSelection";
import Button from "../../components/Button";
import gsap from "gsap";
import CreateFeed from "./CreateFeed";
import Feed from "../../components/Feed";
import ReactBar from "../../components/ReactBar";
import IO from "socket.io-client";

const socket = IO("https://skn7vgp9-9876.asse.devtunnels.ms");

const isVisible = (visibility, userId) => {
  if (Array.isArray(visibility)) {
    return visibility.includes(userId);
  } else {
    return true;
  }
};

const Main = ({ user, signInKey, signout, setChat }) => {
  const contentRef = useRef(null);
  const reactBarRef = useRef(null);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [maxFeed, setMaxFeed] = useState(-1);
  const [currentFeed, setCurrentFeed] = useState(null);
  const [editing, setEditing] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [editDescription, setEditDescription] = useState("");
  const [editSendTo, setEditSendTo] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showReloadPopup, setShowReloadPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    id: "everyone",
    fullname: "Everyone",
  });
  const [turnOffCamera, setTurnOffCamera] = useState(false);

  useEffect(() => {
    console.log(user && feeds.length > 0);
    if (user) {
      const handleSocketEvent = async (data) => {
        console.log(data);
      };

      socket.on("feed", handleSocketEvent);

      // Hủy đăng ký sự kiện khi component unmount
      return () => {
        socket.off("feed", handleSocketEvent);
      };
    }
  }, [user]);

  useEffect(() => {
    if (page === 0) {
      setTurnOffCamera(false);
    } else {
      setTurnOffCamera(true);
    }
  }, [page, turnOffCamera]);

  useEffect(() => {
    if (!currentFeed) return;
    setEditDescription(currentFeed.description);
    setEditSendTo(
      currentFeed.visibility === "everyone" ? [] : currentFeed.visibility
    );
  }, [currentFeed]);

  useEffect(() => {
    const content = contentRef.current;
    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  const sendMessage = async (friendId, comment, feedId) => {
    try {
      setSendingComment(true);
      const response = await fetch(
        `https://skn7vgp9-9876.asse.devtunnels.ms/message/${friendId}`,
        {
          method: "POST",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "Content-Type": "application/json",
            "user-id": user?._id,
          },
          body: JSON.stringify({
            message: comment,
            feedId: feedId,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setChat((chat) => {
          return chat.map((friendChat) => {
            if (friendChat.friendId === friendId) {
              friendChat.messages.push(data.metadata);
            }
            return friendChat;
          });
        });
      } else {
        console.error("Failed to send comment:", data.message);
      }
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsCommenting(false);
      setComment("");
      setSendingComment(false);
    }
  };

  const fetchFeeds = async (page) => {
    if (maxFeed === -1 && page >= feeds.length - 10 && !loading) {
      try {
        if (feeds.length == 0) setLoading(true);
        const response = await fetch(
          `https://skn7vgp9-9876.asse.devtunnels.ms/feed/everyone?skip=${feeds.length}`,
          {
            method: "GET",
            headers: {
              "api-key": "ABC-XYZ-WWW",
              authorization: signInKey,
              "user-id": user?._id,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          if (data.metadata.length == 0) {
            setMaxFeed(feeds.length);
          } else {
            setFeeds((prevV) => [...prevV, ...data.metadata]);
          }
        } else {
          if (data.message === "User ID does not match token") {
            signout();
          }
          console.error("Failed to fetch feeds:", data.message);
        }
      } catch (error) {
        console.error("Error fetching feeds:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCertainFeeds = async (page, userId) => {
    if (maxFeed === -1 && page >= feeds.length - 10 && !loading) {
      try {
        if (feeds.length == 0) setLoading(true);
        const response = await fetch(
          `https://skn7vgp9-9876.asse.devtunnels.ms/feed/certain/${userId}?skip=${feeds.length}`,
          {
            method: "GET",
            headers: {
              "api-key": "ABC-XYZ-WWW",
              authorization: signInKey,
              "user-id": user?._id,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          if (data.metadata.length == 0) {
            setMaxFeed(feeds.length);
          } else {
            setFeeds((prevV) => [...prevV, ...data.metadata]);
          }
        } else {
          if (data.message === "User ID does not match token") {
            signout();
          }
          console.error("Failed to fetch feeds:", data.message);
        }
      } catch (error) {
        console.error("Error fetching feeds:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedUser.id === "everyone") {
      fetchFeeds(page);
    } else {
      console.log("1");
      fetchCertainFeeds(page, selectedUser.id);
    }
  }, [page, feeds, loading]);

  const handleScroll = (direction) => {
    if (contentRef.current && !loading) {
      setEditing(false);
      setLoading(true); // Chặn cuộn khi đang cuộn
      setIsCommenting(false);
      setComment("");
      setPage((oldV) => (oldV === 0 && direction < 0 ? 0 : oldV + direction));
      const scrollAmount = direction * window.innerHeight;
      contentRef.current.scrollBy({ top: scrollAmount, behavior: "smooth" });
      setTimeout(() => {
        setLoading(false);
      }, 500); // 500ms là thời gian ước lượng cho hành động cuộn hoàn tất
    }
  };

  useEffect(() => {
    page !== 0 && setCurrentFeed(feeds[page - 1]);
  }, [page, feeds]);

  const handleTakePhotoBtn = () => {
    setLoading(true);
    setEditing(false);
    setIsCommenting(false);
    setComment("");
    contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setLoading(false);
    }, 500);
    setPage(0);
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        handleScroll(-1);
        break;
      case "ArrowDown":
        handleScroll(1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (page !== 0 && reactBarRef.current) {
      gsap.fromTo(
        reactBarRef.current,
        { y: 300, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 }
      );
    }
  }, [page]);

  const handleReloadFeeds = () => {
    setEditing(false);
    setPage(0);
    setFeeds([]);
    setMaxFeed(-1);
    if (selectedUser.id === "everyone") {
      fetchFeeds(0);
    } else {
      fetchCertainFeeds(0, selectedUser.id);
    }
  };

  const handleGetAllFeeds = () => {
    setEditing(false);
    setPage(0);
    setFeeds([]);
    setMaxFeed(-1);
    fetchFeeds(0);
  };

  const handleGetCertainFeeds = (userId) => {
    setEditing(false);
    setPage(0);
    setFeeds([]);
    setMaxFeed(-1);
    fetchCertainFeeds(0, userId);
  };

  const handleReactFeed = async (feedId, icon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://skn7vgp9-9876.asse.devtunnels.ms/feed/${feedId}`,
        {
          method: "POST",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            icon: icon,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFeeds((preFeeds) =>
          preFeeds.map((f) => {
            if (f._id.toString() === feedId) {
              return data.metadata;
            } else return f;
          })
        );
      } else {
        if (data.message === "User ID does not match token") {
          signout();
        }
        console.error("Failed to fetch feeds:", data.message);
        setShowReloadPopup(true);
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
      setShowReloadPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://skn7vgp9-9876.asse.devtunnels.ms/feed/${currentFeed._id}`,
        {
          method: "PATCH",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: editDescription,
            visibility:
              editSendTo.length === 0 ? "everyone" : editSendTo.join(", "),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFeeds((preFeeds) =>
          preFeeds.map((f) => {
            if (f._id.toString() === currentFeed._id) {
              return data.metadata;
            } else return f;
          })
        );
      } else {
        if (data.message === "User ID does not match token") {
          signout();
        }
        console.error("Failed to fetch feeds:", data.message);
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowPopup(true);
  };

  const cancelDeleteClick = () => {
    setShowPopup(false);
  };

  const handleDelete = async () => {
    try {
      setProcessing(true);
      setLoading(true);
      const response = await fetch(
        `https://skn7vgp9-9876.asse.devtunnels.ms/feed/${currentFeed._id}`,
        {
          method: "DELETE",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFeeds((preFeeds) =>
          preFeeds.filter((f) => f._id.toString() !== currentFeed._id)
        );
        setMaxFeed((preV) => preV - 1);
      } else {
        if (data.message === "User ID does not match token") {
          signout();
        }
        console.error("Failed to fetch feeds:", data.message);
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
    } finally {
      setLoading(false);
      setProcessing(false);
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (firstLoad === true) {
      setFirstLoad(false);
      return;
    }

    if (selectedUser.id === "everyone") {
      handleGetAllFeeds();
    } else {
      console.log("2");
      handleGetCertainFeeds(selectedUser.id);
    }
  }, [selectedUser]);

  return (
    <div className="relative flex flex-col justify-start items-center bg-transparent w-full h-[calc(100vh-64px)] overflow-hidden">
      <div
        ref={contentRef}
        className="relative flex flex-col justify-start items-center bg-transparent w-full h-full overflow-hidden snap-y"
      >
        <FriendSelection
          user={user}
          handleReloadFeeds={handleReloadFeeds}
          handleGetCertainFeeds={handleGetCertainFeeds}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <div className="snap-start w-full h-full flex-shrink-0">
          <CreateFeed
            user={user}
            signInKey={signInKey}
            handleReloadFeeds={handleReloadFeeds}
            turnOffCamera={turnOffCamera}
          />
        </div>
        {feeds.length > 0 && (
          <>
            {feeds.map((feed) => (
              <div
                key={feed?._id}
                className="snap-start w-full h-full flex-shrink-0"
              >
                <Feed
                  feed={feed}
                  user={user}
                  editing={editing}
                  setEditDescription={setEditDescription}
                  setEditSendTo={setEditSendTo}
                />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="absolute flex flex-col space-y-5 right-4 top-1/2 transform -translate-y-1/2 items-center">
        {feeds.length > 0 && (
          <div className=" space-y-5">
            <Button
              isActive={!loading && page !== 0}
              text={<p className="text-black bold text-2xl px-1">↑</p>}
              handleClick={
                !loading && page !== 0 ? () => handleScroll(-1) : () => {}
              }
            />
            <Button
              isActive={!loading && (page !== maxFeed || maxFeed === -1)}
              text={<p className="text-black bold text-2xl px-1">↓</p>}
              handleClick={
                !loading && (page !== maxFeed || maxFeed === -1)
                  ? () => handleScroll(1)
                  : () => {}
              }
            />
          </div>
        )}

        {!loading && (
          <Button
            isActive={!loading}
            text={<p className="text-black bold text-2xl px-1">↻</p>}
            handleClick={!loading ? handleReloadFeeds : () => {}}
          />
        )}
      </div>
      {page !== 0 && feeds.length !== 0 && (
        <div
          ref={reactBarRef}
          className="fixed bottom-0 w-full flex justify-center"
        >
          <ReactBar
            handleTakePhotoBtn={handleTakePhotoBtn}
            isEditable={
              currentFeed?.userId?._id.toString() === user?._id?.toString()
                ? true
                : false
            }
            feed={currentFeed}
            handleReactFeed={handleReactFeed}
            user={user}
            setEditing={setEditing}
            editing={editing}
            saveEdit={saveEdit}
            handleDeleteClick={handleDeleteClick}
            isCommenting={isCommenting}
            setIsCommenting={setIsCommenting}
            comment={comment}
            setComment={setComment}
            sendMessage={sendMessage}
            sendingComment={sendingComment}
          />
        </div>
      )}
      {showPopup && (
        <div className="z-20">
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
            <div className="bg-black rounded-3xl w-[400px] h-[200px] bg-opacity-1 shadow-2xl shadow-yellow-500 ">
              <p className="mt-8 mb-4 text-gray bold text-lg">
                Do you want to delete this feed?
              </p>
              <div className="mt-14 flex justify-center items-center space-x-4">
                <Button
                  text={processing ? "Processing..." : "Yes, I do"}
                  isActive={true}
                  handleClick={handleDelete}
                />
                <Button
                  text={"No, I don't"}
                  isActive={true}
                  handleClick={cancelDeleteClick}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showReloadPopup && (
        <div className="z-20">
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
            <div className="bg-black rounded-3xl w-[400px] h-[200px] bg-opacity-1 shadow-2xl shadow-yellow-500 ">
              <p className="mt-8 mb-4 text-gray bold text-lg">
                This feed is currently unavailable, Please reload to update
                feeds!
              </p>
              <div className="mt-14 mb-2 flex justify-center items-center space-x-4">
                <Button
                  text={"Reload"}
                  isActive={true}
                  handleClick={() => {
                    setShowReloadPopup(false);
                    handleReloadFeeds();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
