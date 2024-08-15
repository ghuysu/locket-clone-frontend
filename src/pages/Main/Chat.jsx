import React, { useState } from "react";
import ChatSidebar from "../../components/ChatSidebar";
import ChatScreen from "../../components/ChatScreen";

const Chat = ({ chat, setChat, user, signInKey, setUser }) => {
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  return (
    <div className="justify-start flex items-center h-[calc(100vh_-_60px)] max-h-[calc(100vh_-_60px)]">
      <ChatSidebar
        user={user}
        chat={chat}
        selectedFriendId={selectedFriendId}
        setSelectedFriendId={setSelectedFriendId}
      />
      <ChatScreen
        chat={chat}
        selectedFriendId={selectedFriendId}
        user={user}
        signInKey={signInKey}
        setChat={setChat}
      />
    </div>
  );
};
export default Chat;
