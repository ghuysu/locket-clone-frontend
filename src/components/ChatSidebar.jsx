import React, { useCallback } from "react";
import FriendChatBar from "./FriendChatBar";

const ChatSidebar = ({ chat, selectedFriendId, setSelectedFriendId, user }) => {
  const unSeenMessage = useCallback((friendChat) => {
    return friendChat.messages.some(
      (message) => message.isRead === false && message.receiver._id === user._id
    );
  }, []);

  return (
    <div className="h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)] w-[250px] max-w-[250px] bg-zinc-900">
      <div className="flex items-center h-[50px]">
        <p className="text-[18px] text-gray pl-[20px] semibold">Chats</p>
      </div>
      <div className="h-[calc(100vh_-_110px)] max-h-[calc(100vh_-_60px)] w-[250px] max-w-[250px] overflow-hidden overflow-y-auto flex flex-col justify-start items-center p-2 pl-[20px]">
        {chat.map((friendChat) => {
          return (
            <div
              key={friendChat.friendId}
              className="cursor-pointer w-full"
              onClick={() => {
                setSelectedFriendId(friendChat.friendId);
              }}
            >
              {friendChat.messages.length !== 0 ? (
                <FriendChatBar
                  id={friendChat.friendId}
                  imageUrl={friendChat.friendImageUrl}
                  fullname={friendChat.friendFullname}
                  isNew={unSeenMessage(friendChat)}
                  selectedFriendId={selectedFriendId}
                  message={
                    friendChat.messages[friendChat.messages.length - 1].content
                  }
                  sendTime={
                    friendChat.messages[friendChat.messages.length - 1]
                      .createdAt
                  }
                />
              ) : (
                <FriendChatBar
                  id={friendChat.friendId}
                  imageUrl={friendChat.friendImageUrl}
                  fullname={friendChat.friendFullname}
                  isNew={unSeenMessage(friendChat)}
                  selectedFriendId={selectedFriendId}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
