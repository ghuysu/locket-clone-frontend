import React, { useRef, useEffect, useState } from "react";
import FeedChat from "./FeedChat";
import ChatBar from "./ChatBar";
import { gsap } from "gsap";

const ChatScreen = ({ chat, selectedFriendId, setChat, user, signInKey }) => {
  const [message, setMessage] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loadedAllMessages, setLoadedAllMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const loadingRef = useRef(null);

  const loadedAllMessagesRef = useRef(loadedAllMessages);
  const loadingMoreMessagesRef = useRef(loadingMoreMessages);

  useEffect(() => {
    loadedAllMessagesRef.current = loadedAllMessages;
  }, [loadedAllMessages]);

  useEffect(() => {
    loadingMoreMessagesRef.current = loadingMoreMessages;
  }, [loadingMoreMessages]);

  useEffect(() => {
    setSelectedChat(
      chat.find((friendChat) => friendChat.friendId === selectedFriendId)
    );
  }, [selectedFriendId, chat]);

  useEffect(() => {
    if (selectedChat && chatContainerRef.current) {
      if (isFirstLoad) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
        setIsFirstLoad(false);
      }

      const handleScroll = async () => {
        if (loadedAllMessagesRef.current) return;
        if (loadingMoreMessagesRef.current) return;
        if (chatContainerRef.current.scrollTop <= 800) {
          chatContainerRef.current.removeEventListener("scroll", handleScroll);
          await getMoreMessages();
          chatContainerRef.current.addEventListener("scroll", handleScroll);
        }
      };

      chatContainerRef.current.addEventListener("scroll", handleScroll);

      return () => {
        if (chatContainerRef.current)
          chatContainerRef.current.removeEventListener("scroll", handleScroll);
      };
    }
  }, [selectedChat, isFirstLoad]);

  useEffect(() => {
    if (!selectedChat) return;

    const unSeenMessageIds = selectedChat.messages
      .filter((message) => {
        if (!message.isRead && message.receiver._id === user._id) {
          return true;
        }
      })
      .map((message) => message._id);

    if (unSeenMessageIds.length > 0) {
      const markMessagesAsRead = async () => {
        try {
          await readMessages(unSeenMessageIds);
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markMessagesAsRead();
    }
  }, [selectedChat, chat]);

  // New useEffect for loading animation
  useEffect(() => {
    if (loadingMoreMessages && loadingRef.current) {
      const tween = gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "linear",
      });

      return () => {
        tween.kill(); // Stop the animation when the component unmounts or loadingMoreMessages becomes false
      };
    }
  }, [loadingMoreMessages]);

  const getMoreMessages = async () => {
    if (loadedAllMessagesRef.current) return;
    if (loadingMoreMessagesRef.current) return;
    try {
      setLoadingMoreMessages(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/message/certain/${
          selectedChat.friendId
        }?skip=${selectedChat.messages.length}`,
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
        if (data.metadata.length === 0) {
          setLoadedAllMessages(true);
          setLoadingMoreMessages(false);
          return;
        }
        setChat((chat) => {
          return chat.map((friendChat) => {
            if (friendChat.friendId === selectedFriendId) {
              friendChat.messages = [...data.metadata, ...friendChat.messages];
            }
            return friendChat;
          });
        });
      } else {
        console.error("Failed to fetch feeds:", data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  const readMessages = async (messageIds) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/message/read`,
        {
          method: "PATCH",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "Content-Type": "application/json",
            "user-id": user?._id,
          },
          body: JSON.stringify({
            messageIds: messageIds,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setChat((chat) => {
          return chat.map((friendChat) => {
            if (friendChat.friendId === selectedFriendId) {
              friendChat.messages.map((message) => {
                if (messageIds.includes(message._id)) {
                  message.isRead = true;
                }
                return message;
              });
            }
            return friendChat;
          });
        });
      } else {
        console.error("Failed to read message:", data);
      }
    } catch (error) {
      console.error("Error read message:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent sending empty messages
    try {
      setSending(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/message/${selectedChat.friendId}`,
        {
          method: "POST",
          headers: {
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "Content-Type": "application/json",
            "user-id": user?._id,
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setChat((chat) => {
          return chat.map((friendChat) => {
            if (friendChat.friendId === selectedFriendId) {
              friendChat.messages.push(data.metadata);
            }
            return friendChat;
          });
        });
        setMessage(""); // Clear the message input after sending
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-zinc-800 h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] w-[calc(100vw_-_250px)] overflow-hidden border-l-2 border-t-2 border-zinc-800 flex flex-col">
      {selectedChat ? (
        <>
          <div className="w-full h-[50px] bg-black bg-opacity-90 flex items-center border-b-2 border-zinc-900 pl-3 py-2 z-10">
            <img
              src={selectedChat.friendImageUrl}
              alt={`${selectedChat.friendFullname.firstname} ${selectedChat.friendFullname.lastname}`}
              className="w-9 h-9 rounded-full mr-2"
            />
            <span className="text-white text-sm medium">
              {`${selectedChat.friendFullname.firstname} ${selectedChat.friendFullname.lastname}`}
            </span>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto"
            style={{ display: "flex", flexDirection: "column-reverse" }}
          >
            <div className="p-2">
              {loadingMoreMessages && (
                <div className="flex justify-center mb-4">
                  <img
                    ref={loadingRef}
                    src="/assets/images/loadingCircle.png"
                    alt="loading"
                    className="w-6"
                  />
                </div>
              )}
              {selectedChat.messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === selectedFriendId
                      ? "justify-start"
                      : "justify-end"
                  } mb-4`}
                >
                  <div
                    className={`semibold ${
                      message.sender._id === selectedFriendId
                        ? "bg-zinc-900 bg-opacity-70 text-white"
                        : "bg-zinc-200 bg-opacity-80 text-black"
                    } p-3 rounded-3xl max-w-xs`}
                  >
                    <p className="text-sm text-left">{message.content}</p>
                    {message.feedId && (
                      <FeedChat
                        feed={message.feedId}
                        user={user}
                        friend={{
                          friendId: selectedChat.friendId,
                          friendImageUrl: selectedChat.friendImageUrl,
                          friendFullname: selectedChat.friendFullname,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <ChatBar
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              sending={sending}
            />
          </div>
        </>
      ) : (
        <div className="text-white text-center mt-20">
          Select a friend to start chatting.
        </div>
      )}
    </div>
  );
};

export default ChatScreen;
