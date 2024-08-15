import React from "react";
import moment from "moment";

const FeedChat = ({ feed, friend, user }) => {
  const formatTime = (time) => {
    const now = moment();
    const feedTime = moment(time);
    const diffInMinutes = now.diff(feedTime, "minutes");
    const diffInHours = now.diff(feedTime, "hours");
    const diffInDays = now.diff(feedTime, "days");

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return feedTime.format("DD MMM");
    }
  };

  return (
    <div className="relative">
      <img
        src={feed.imageUrl}
        alt={feed.description}
        className="mt-2 rounded-[25px]"
      />
      <div className="absolute px-2 py-1 rounded-3xl bg-[#8F9089] bg-opacity-60 flex space-x-1 top-2 left-3 items-center">
        <img
          className="w-5 h-5 rounded-full"
          src={
            feed.userId === user._id
              ? user.profileImageUrl
              : friend.friendImageUrl
          }
        />
        <p className="text-xs">
          {feed.userId === user._id ? "You" : friend.friendFullname.firstname}
        </p>
      </div>
      <div className="absolute rounded-3xl bg-[#8F9089] bg-opacity-60 top-2 right-3 py-1 px-2">
        <p className="text-xs">{formatTime(feed.createdAt)}</p>
      </div>
      {feed.description.length !== 0 && (
        <div className="absolute rounded-3xl bg-[#8F9089] bg-opacity-60 py-2 px-2 bottom-3 right-1/2 translate-x-1/2">
          <p className="text-xs">{feed.description}</p>
        </div>
      )}
    </div>
  );
};

export default FeedChat;
