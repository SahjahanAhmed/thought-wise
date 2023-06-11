import React, { useState } from "react";
import img from "../../src/media/images/sj-smiling-stareing.jpg";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
const Suggestion = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div
        className={`max-h-[190px] md:max-h-full  flex flex-row md:flex-col justify-start gap-4 md:flex-[2] ml-2 md:ml-0 w-full max-w-[500px] border shadow-sm rounded-lg relative md:sticky md:top-14 pb-3  ${
          !isOpen
            ? "h-7 md:h-auto  overflow-hidden md:overflow-visible  pb-10 md:pd-0"
            : ""
        }`}
      >
        {isOpen && (
          <button
            className="text-xl  text-gray-400 hover:text-black absolute  md:opacity-0 -bottom-1 left-[50%] translate-x-[-50%]"
            onClick={() => setIsOpen(false)}
          >
            <FiChevronUp />
          </button>
        )}

        {!isOpen && (
          <button
            className=" text-xl  text-gray-400 hover:text-black absolute md:opacity-0 bottom-0 left-[60%] "
            onClick={() => setIsOpen(true)}
          >
            <FiChevronDown />
          </button>
        )}

        <div className="w-full ">
          <h1 className="text-center mb-1 font-semibold text-gray-800">
            Suggetions
          </h1>
          <div
            className={`flex  md:flex-col md:p-4  md:gap-8 ${
              !isOpen ? "mt-10 md:mt-0 " : ""
            }`}
          >
            <div className={`flex-1 md:flex-[0] `}>
              <h1 className="font-semibold text-center text-gray-500">
                People
              </h1>
              <ul className=" overflow-y-hidden max-h-[120px] md:max-h-[400px] flex flex-col gap-2 items-start relative">
                <li>
                  <Link
                    to="/"
                    className="flex justify-start items-start  cursor-pointer hover:text-gray-600"
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="ml-1">Elon Musk</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="flex  cursor-pointer hover:text-gray-600 "
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover "
                    />
                    <span className="max-w-[80%] ml-1">
                      The bull Warren buffet and brothers
                    </span>
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-600"
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>Elon Musk</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-600"
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>Elon Musk</span>
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-600"
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>Elon Musk</span>
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-600"
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>Mark Zuckerburg</span>
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-600"
                  >
                    <img
                      src={img}
                      alt="people"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span>Elon Musk miah nolo dk</span>
                  </Link>
                </li>
                <button className="absolute text-right  w-auto right-6   -bottom-1 bg-[#f7f7f7] z-10  text-blue-400 hover:text-blue-700 text-sm rounded">
                  ... See more
                </button>
              </ul>
            </div>
            <div
              className={`flex-1 md:flex-[0] overflow-hidden max-h-[145px] md:max-h-[220px] flex flex-col items-center relative `}
            >
              <button className="absolute text-right -bottom-0 right-6 bg-[#f7f7f7] z-10  w-auto  text-blue-400 hover:text-blue-700 text-sm rounded">
                ... See more
              </button>
              <h1 className=" text-center font-semibold text-gray-500">
                Thoughts
              </h1>
              <ul className="w-[80%] md:w-full overflow-hidden">
                <li>
                  <Link to={"/"} className="hover:text-gray-500 flex relative ">
                    <img
                      src={img}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover absolute"
                    />
                    <span className="ml-7">
                      {" "}
                      {"If you are not able to find a bug in a code by watching thecodebase then you are not ready yet".slice(
                        0,
                        40
                      ) + "  ..."}
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to={"/"} className="hover:text-gray-500 flex relative ">
                    <img
                      src={img}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover absolute"
                    />
                    <span className="ml-7">
                      {" "}
                      {"If you are not able to find a bug in a code by watching thecodebase then you are not ready yet".slice(
                        0,
                        40
                      ) + "  ..."}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to={"/"} className="hover:text-gray-500 flex relative ">
                    <img
                      src={img}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover absolute"
                    />
                    <span className="ml-7">
                      {" "}
                      {"If you are not able to find a bug in a code by watching thecodebase then you are not ready yet".slice(
                        0,
                        40
                      ) + "  ..."}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Suggestion;
