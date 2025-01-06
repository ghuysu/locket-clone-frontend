import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProfileBar from "../../components/ProfileBar";
import DeleteButton from "../../components/DeleteButton";
import SmallProfileBar from "../../components/SmallProfileBar";
import AcceptButton from "../../components/AcceptButton";
import Popup from "../../components/Popup";

const UserProfile = ({ user, setUser, signInKey, setLoading }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const contentRef = useRef(null);
  const profileBarRef = useRef(null);
  const friendDivRef = useRef(null);
  const receivedInviteDivRef = useRef(null);
  const sentInviteDivRef = useRef(null);

  const numberOfFriends = user.friendList.length;
  const numberOfInvites = user.receivedInviteList.length;
  const numberOfSentInvites = user.sentInviteList.length;

  const friendList = user.friendList.map((friend) => (
    <div key={friend._id.toString()} className="relative">
      <SmallProfileBar user={friend} />
      <div className="ml-5 absolute right-2 top-[7px]">
        <DeleteButton clickHandler={() => handleDeleteFriend(friend._id)} />
      </div>
    </div>
  ));

  const inviteList = user.receivedInviteList.map((invite) => (
    <div key={invite._id.toString()} className="relative">
      <SmallProfileBar user={invite} />
      <div className="ml-5 absolute right-2 top-[7px] flex">
        <AcceptButton clickHandler={() => handleAcceptInvite(invite._id)} />
        <div className="ml-2"></div>
        <DeleteButton
          clickHandler={() => handleRemoveReceivedInvite(invite._id)}
        />
      </div>
    </div>
  ));

  const sentInviteList = user.sentInviteList.map((invite) => (
    <div key={invite._id.toString()} className="relative">
      <SmallProfileBar user={invite} />
      <div className="ml-5 absolute right-2 top-[7px]">
        <DeleteButton clickHandler={() => handleRemoveSentInvite(invite._id)} />
      </div>
    </div>
  ));

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(
        profileBarRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(
        friendDivRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(
        receivedInviteDivRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(
        sentInviteDivRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
  }, []);

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
      className="flex flex-col justify-start items-center bg-transparent"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        ref={contentRef}
        className="flex flex-col justify-start items-center"
      >
        <p className="text-xl bold text-yellow-500 my-4">
          Let's see your wonderful profile
        </p>
        <div className="mb-5"></div>
        <div ref={profileBarRef} className="">
          <ProfileBar user={user} />
        </div>
        <div className="mt-4 flex space-x-7">
          <div
            ref={friendDivRef}
            className="lg:w-[450px] md:w-[335px] h-[600px] flex flex-col justify-start items-center rounded-3xl bg-black"
          >
            <p className="text-yellow-600 text-base semibold mt-4">
              {numberOfFriends} Friends
            </p>
            <div className="flex flex-col items-center flex-start space-y-2 w-full h-full overflow-y-auto p-2">
              {friendList}
            </div>
          </div>
          <div className="flex flex-col space-y-6">
            <div
              ref={receivedInviteDivRef}
              className="lg:w-[450px] md:w-[335px] h-[288px] flex flex-col justify-start items-center rounded-3xl bg-black"
            >
              <p className="text-yellow-600 text-base semibold mt-4">
                {numberOfInvites} Received invites
              </p>
              <div className="flex flex-col items-center flex-start space-y-2 w-full h-full overflow-y-auto p-2">
                {inviteList}
              </div>
            </div>
            <div
              ref={sentInviteDivRef}
              className="lg:w-[450px] md:w-[335px] h-[288px] flex flex-col justify-start items-center rounded-3xl bg-black"
            >
              <p className="text-yellow-600 text-base semibold mt-4">
                {numberOfSentInvites} Sent invites
              </p>
              <div className="flex flex-col items-center flex-start space-y-2 w-full h-full overflow-y-auto p-2">
                {sentInviteList}
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default UserProfile;
