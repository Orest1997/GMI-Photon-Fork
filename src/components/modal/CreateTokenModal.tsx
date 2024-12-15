import React, { useEffect, useState } from "react";
import Modal from ".";

interface CreateTokenModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateTokenModal: React.FC<CreateTokenModalProps> = ({
  open,
  setOpen,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [description, setDescription] = useState("");

  const [websiteLink, setWebsiteLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");

  const handleShowOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <Modal
      isOpen={open}
      closeModal={() => {
        setOpen(false);
      }}
      title="Create a new Token 🔥"
    >
      <hr className="my-3 text-light-gray" />
      <div className="grid grid-cols-1 gap-4 my-2 mt-6 rounded-sm">
        <div className="flex justify-between gap-4">
          <div className="bg-[#00000033] rounded-full px-5 py-2 w-full">
            <input
              className="outline-none bg-transparent w-full"
              placeholder="Name"
            ></input>
          </div>
          <div className="bg-[#00000033] rounded-full px-5 py-2 w-full">
            <input
              className="outline-none bg-transparent w-full"
              placeholder="Ticker"
            ></input>
          </div>
        </div>

        <textarea
          className="bg-[#00000033] p-4 rounded-2xl"
          placeholder="Description"
          rows={5}
        ></textarea>

        <div className="flex items-center justify-center gap-2 bg-[#00000033] rounded-2xl p-4 cursor-pointer">
          <img src="assets/icons/upload.svg"></img>
          <span>Upload image / video</span>
        </div>

        <div
          className="flex items-center justify-center gap-4 cursor-pointer py-4"
          onClick={handleShowOptions}
        >
          <span className="text-xs">Show Additional Options</span>
          <img
            src="assets/icons/optiondown.svg"
            className={`size-3 ${
              showOptions ? "" : "rotate-180"
            } transition-all`}
          ></img>
        </div>
        {showOptions ? (
          <>
            <div className="flex gap-4">
              <div className="bg-[#00000033] px-5 py-2 rounded-full w-full">
                <input
                  className="bg-transparent w-full"
                  placeholder="Twitter Link"
                />
              </div>
              <div className="bg-[#00000033] px-5 py-2 rounded-full w-full">
                <input
                  className="bg-transparent w-full"
                  placeholder="Telegram Link"
                />
              </div>
            </div>

            <div className="bg-[#00000033] px-5 py-2 rounded-full">
              <input
                className="bg-transparent w-full"
                placeholder="Website Link"
              />
            </div>
          </>
        ) : (
          <></>
        )}

        <button className="primary w-full hover:scale-105">Create</button>
      </div>
    </Modal>
  );
};

export default CreateTokenModal;
