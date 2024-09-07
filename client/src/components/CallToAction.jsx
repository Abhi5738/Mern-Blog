import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <>
      <div className=" flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className=" flex-1 justify-center flex flex-col ">
          <h2 className="text-2xl">Want to learn more about JavaScript ?</h2>
          <p className="text-gray-500 my-2">
            Checkout these resources with 100 javascript Projects
          </p>
          <Link
            to="https://www.100jsprojects.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              gradientDuoTone="purpleToPink"
              className="rounded-tl-xl rounded-bl-none w-full"
            >
              100 JavaScript Projects
            </Button>
          </Link>
        </div>
        <div className="p-7">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1DmLCy9PSJfFqO55mNTYOQLx3x8THsbokkw&s"
            alt="javascript"
          />
        </div>
      </div>
    </>
  );
};

export default CallToAction;
