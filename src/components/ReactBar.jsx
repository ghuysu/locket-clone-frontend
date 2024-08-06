import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SmallTakePhotoButton from "./SmallTakePhotoButton";
import Button from "./Button";

const ReactBar = ({
  handleTakePhotoBtn,
  isEditable,
  feed,
  handleDeleteClick,
  handleReactFeed,
  user,
  setEditing,
  editing,
  saveEdit,
}) => {
  const likeRef = useRef(null);
  const loveRef = useRef(null);
  const hahaRef = useRef(null);
  const wowRef = useRef(null);
  const sadRef = useRef(null);
  const angryRef = useRef(null);

  const [hovered, setHovered] = useState(false);

  const isIconReacted = (icon) => {
    const reaction = feed?.reactions?.find(
      (reaction) => reaction?.userId?._id?.toString() === user?._id?.toString()
    );
    if (!reaction) {
      return false;
    }
    if (reaction?.icon === icon) return true;
    else return false;
  };

  useEffect(() => {
    const images = [
      likeRef.current,
      loveRef.current,
      hahaRef.current,
      wowRef.current,
      sadRef.current,
      angryRef.current,
    ];

    if (!isEditable) {
      images.forEach((image) => {
        const handleMouseEnter = () => {
          gsap.to(image, { scale: 0.8, duration: 0.1, ease: "power1.inOut" });
        };
        const handleMouseLeave = () => {
          gsap.to(image, { scale: 1, duration: 0.1, ease: "power1.inOut" });
        };

        image.addEventListener("mouseenter", handleMouseEnter);
        image.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          image.removeEventListener("mouseenter", handleMouseEnter);
          image.removeEventListener("mouseleave", handleMouseLeave);
        };
      });
    }
  }, [isEditable]);

  return (
    <div className="relative fixed bottom-3 w-[400px] flex flex-col justify-center items-center">
      <div
        className="flex items-center px-6 py-2 space-x-4 rounded-[32px] mb-3 bg-zinc-800"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`${!isEditable && "cursor-pointer"} ${
            isIconReacted("like") && "bg-zinc-700 rounded-3xl p-3"
          }`}
          onClick={
            isEditable
              ? () => {}
              : () => {
                  handleReactFeed(feed._id, "like");
                }
          }
        >
          <img
            ref={likeRef}
            className="w-8 -translate-y-[3px]"
            src="/public/assets/images/like.png"
          />
          <p className="text-gray text-sm bold">
            {feed?.reactionStatistic?.like}
          </p>
        </div>
        <div
          className={`${!isEditable && "cursor-pointer"} ${
            isIconReacted("love") && "bg-zinc-700 rounded-3xl p-3"
          }`}
          onClick={
            isEditable
              ? () => {}
              : () => {
                  handleReactFeed(feed._id, "love");
                }
          }
        >
          <img
            ref={loveRef}
            className="w-8"
            src="/public/assets/images/love.png"
          />
          <p className="text-gray text-sm bold">
            {feed?.reactionStatistic?.love}
          </p>
        </div>
        <div
          className={`${!isEditable && "cursor-pointer"} ${
            isIconReacted("haha") && "bg-zinc-700 rounded-3xl p-3"
          }`}
          onClick={
            isEditable
              ? () => {}
              : () => {
                  handleReactFeed(feed._id, "haha");
                }
          }
        >
          <img
            ref={hahaRef}
            className="w-8"
            src="/public/assets/images/haha.png"
          />
          <p className="text-gray text-sm bold">
            {feed?.reactionStatistic?.haha}
          </p>
        </div>
        <div
          className={`${!isEditable && "cursor-pointer"} ${
            isIconReacted("wow") && "bg-zinc-700 rounded-3xl p-3"
          }`}
          onClick={
            isEditable
              ? () => {}
              : () => {
                  handleReactFeed(feed._id, "wow");
                }
          }
        >
          <img
            ref={wowRef}
            className="w-8"
            src="/public/assets/images/wow.png"
          />
          <p className="text-gray text-sm bold">
            {feed?.reactionStatistic?.wow}
          </p>
        </div>
        <div
          className={`${!isEditable && "cursor-pointer"} ${
            isIconReacted("sad") && "bg-zinc-700 rounded-3xl p-3"
          }`}
          onClick={
            isEditable
              ? () => {}
              : () => {
                  handleReactFeed(feed._id, "sad");
                }
          }
        >
          <img
            ref={sadRef}
            className="w-8"
            src="/public/assets/images/sad.png"
          />
          <p className="text-gray text-sm bold">
            {feed?.reactionStatistic?.sad}
          </p>
        </div>
        <div
          className={`${!isEditable && "cursor-pointer"} ${
            isIconReacted("angry") && "bg-zinc-700 rounded-3xl p-3"
          }`}
          onClick={
            isEditable
              ? () => {}
              : () => {
                  handleReactFeed(feed._id, "angry");
                }
          }
        >
          <img
            ref={angryRef}
            className="w-8"
            src="/public/assets/images/angry.png"
          />
          <p className="text-gray text-sm bold">
            {feed?.reactionStatistic?.angry}
          </p>
        </div>
      </div>
      {isEditable && feed.reactions.length !== 0 && hovered && (
        <div className="absolute bottom-36 bg-zinc-800 bg-opacity-90 rounded-3xl p-2 mb-3 w-[300px]">
          <p className="text-gray text-sm bold">Reactions:</p>
          <div className="flex flex-col space-y-2 mt-2">
            {feed.reactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full px-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={reaction.userId.profileImageUrl}
                    className="w-6 rounded-full"
                  />
                  <p className="text-gray text-xs">
                    {reaction.userId.fullname.firstname}
                  </p>
                </div>
                <div className="flex justify-end">
                  <img
                    className="w-4"
                    src={`/public/assets/images/${reaction.icon}.png`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-center space-x-10">
        {isEditable && (
          <Button
            isActive={true}
            text={
              <img
                className={`w-5 ${!editing && "ml-1"}`}
                src={
                  editing
                    ? "/public/assets/images/cancel.png"
                    : "/public/assets/images/edit.png"
                }
              />
            }
            handleClick={
              editing
                ? () => {
                    setEditing(false);
                  }
                : () => {
                    setEditing(true);
                  }
            }
          />
        )}
        <SmallTakePhotoButton handleClick={handleTakePhotoBtn} />
        {isEditable && (
          <Button
            isActive={true}
            text={
              <img
                className={`w-5 mx-[2px]`}
                src={
                  editing
                    ? "/public/assets/images/accept.png"
                    : "/public/assets/images/delete.png"
                }
              />
            }
            handleClick={editing ? saveEdit : handleDeleteClick}
          />
        )}
      </div>
    </div>
  );
};

export default ReactBar;
