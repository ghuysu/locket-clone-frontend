import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import ProfileBar from "../../components/ProfileBar";
import AddButton from "../../components/AddButton";
import DeleteButton from "../../components/DeleteButton";
import AcceptButton from "../../components/AcceptButton";
import Popup from "../../components/Popup";
import Loading from "../../components/Loading";

const Search = ({
  searchKey,
  searchResult,
  user,
  setUser,
  signInKey,
  setLoading,
}) => {
  const [friends, setFriends] = useState([]);
  const [sentInvite, setSentInvite] = useState([]);
  const [receivedInvite, setReceivedInvite] = useState([]);
  const [strangers, setStrangers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const friendsRef = useRef([]);
  const sentInviteRef = useRef([]);
  const receivedInviteRef = useRef([]);
  const strangersRef = useRef([]);

  const isFriend = (friendId) => {
    return user.friendList.some(
      (friend) => friend._id.toString() === friendId.toString()
    );
  };

  const isSentInvite = (friendId) => {
    return user.sentInviteList.some(
      (friend) => friend._id.toString() === friendId.toString()
    );
  };

  const isReceivedInvite = (friendId) => {
    return user.receivedInviteList.some(
      (friend) => friend._id.toString() === friendId.toString()
    );
  };

  useEffect(() => {
    const friendsList = [];
    const sentInviteList = [];
    const receivedInviteList = [];
    const strangersList = [];

    searchResult.forEach((friend) => {
      if (isFriend(friend._id)) {
        friendsList.push(
          <div
            key={friend._id}
            className="flex justify-center items-center space-x-2"
          >
            <ProfileBar user={friend} />
            <DeleteButton clickHandler={() => handleDeleteFriend(friend._id)} />
          </div>
        );
      } else if (isSentInvite(friend._id)) {
        sentInviteList.push(
          <div
            key={friend._id}
            className="flex justify-center items-center space-x-2"
          >
            <ProfileBar user={friend} />
            <DeleteButton
              clickHandler={() => handleRemoveSentInvite(friend._id)}
            />
          </div>
        );
      } else if (isReceivedInvite(friend._id)) {
        receivedInviteList.push(
          <div
            key={friend._id}
            className="flex justify-center items-center space-x-2"
          >
            <ProfileBar user={friend} />
            <AcceptButton clickHandler={() => handleAcceptInvite(friend._id)} />
            <DeleteButton
              clickHandler={() => handleRemoveReceivedInvite(friend._id)}
            />
          </div>
        );
      } else {
        strangersList.push(
          <div
            key={friend._id}
            className="flex justify-center items-center space-x-2"
          >
            <ProfileBar user={friend} />
            <AddButton clickHandler={() => handleSendInvite(friend._id)} />
          </div>
        );
      }
    });

    setFriends(friendsList);
    setSentInvite(sentInviteList);
    setReceivedInvite(receivedInviteList);
    setStrangers(strangersList);
  }, [searchResult, user]);

  useEffect(() => {
    gsap.from(friendsRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
    gsap.from(sentInviteRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
    gsap.from(receivedInviteRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
    gsap.from(strangersRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
    });
  }, [friends, sentInvite, receivedInvite, strangers]);

  const handleDeleteFriend = (friendId) => {
    setSelectedFriendId(friendId);
    setShowPopup(true);
  };

  const handleAcceptInvite = async (friendId) => {
    setLoading(true);
    try {
      console.log(friendId);
      const response = await fetch(
        "http://localhost:9876/account/friend/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
          body: JSON.stringify({ friendId: friendId }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data.metadata);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleRemoveReceivedInvite = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:9876/account/friend/remove-invite-receiver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
          body: JSON.stringify({ friendId: friendId }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data.metadata);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleSendInvite = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:9876/account/friend/send-invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
          body: JSON.stringify({ friendId: friendId }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data.metadata);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleRemoveSentInvite = async (friendId) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:9876/account/friend/remove-invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
          body: JSON.stringify({ friendId: friendId }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data.metadata);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const confirmDeleteFriend = async () => {
    setShowPopup(false);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:9876/account/friend/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": "ABC-XYZ-WWW",
            authorization: signInKey,
            "user-id": user?._id,
          },
          body: JSON.stringify({ friendId: selectedFriendId }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setUser(data.metadata);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const cancelDeleteFriend = () => {
    setShowPopup(false);
  };

  return (
    <div
      className="flex flex-col items-left justify-start overflow-y-auto"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <p className="text-gray mt-3">
        {" "}
        Search result for{" "}
        <span className="text-yellow-500 bold">{searchKey}</span>{" "}
      </p>

      {strangers.length > 0 && (
        <div
          className="flex flex-col items-start justify-start space-y-2 p-5 mt-5"
          ref={strangersRef}
        >
          <p className="text-zinc-600 text-sm mt-3">Strangers</p>
          {strangers}
        </div>
      )}

      {sentInvite.length > 0 && (
        <div
          className="flex flex-col items-start justify-start space-y-2 p-5 mt-5"
          ref={sentInviteRef}
        >
          <p className="text-zinc-600 text-sm mt-3">
            Strangers received your invitation
          </p>
          {sentInvite}
        </div>
      )}

      {receivedInvite.length > 0 && (
        <div
          className="flex flex-col items-start justify-start space-y-2 p-5 mt-5"
          ref={receivedInviteRef}
        >
          <p className="text-zinc-600 text-sm mt-3">
            Strangers sent you an invitation
          </p>
          {receivedInvite}
        </div>
      )}

      {friends.length > 0 && (
        <div
          className="flex flex-col items-start justify-start space-y-2 p-5 mt-5"
          ref={friendsRef}
        >
          <p className="text-zinc-600 text-sm mt-3">Friends</p>
          {friends}
        </div>
      )}

      {searchResult.length === 0 && (
        <div>
          <p className="text-zinc-700 mt-10 text-base">No results found</p>
        </div>
      )}

      {showPopup && (
        <div className="z-20">
          <Popup
            message="Do you want to delete this friend?"
            onConfirm={confirmDeleteFriend}
            onCancel={cancelDeleteFriend}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
