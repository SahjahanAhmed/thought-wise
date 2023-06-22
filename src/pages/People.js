import React from "react";
import { useSelector } from "react-redux";
import SinglePeople from "../components/SinglePeople";

const People = ({ searchModal, setSearchModal }) => {
  const { users } = useSelector((store) => store.users);
  // const mixedUsers =
  return (
    <>
      {searchModal && (
        <div
          className=" fixed  w-[screen] top-0 left-0 right-0 bottom-0 z-[800] bg-[rgba(0,0,0,.8)]"
          onClick={() => setSearchModal(false)}
        ></div>
      )}
      <div className="max-w-[1000px] mx-auto p-2">
        <h1 className="text-center text-gray-800 text-2xl  font-ubuntu">
          People you may love to know
        </h1>
        <div
          className={`max-w-[600px] overflow-y-scroll scrollbar-none border-2 mx-auto shadow-mg rounded-lg p-2 mt-10 flex flex-col gap-4 items-start`}
        >
          {users.map((user) => (
            <SinglePeople user={user} />
          ))}
        </div>
      </div>
    </>
  );
};

export default People;
