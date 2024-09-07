import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        dispatch(signInSuccess(result));
        navigate("/");
      }
    } catch (error) {
      console.log("error :", error);
    }
  };
  return (
    <>
      <Button
        type="button"
        className="w-full mt-4 "
        gradientDuoTone="pinkToOrange"
        outline
        onClick={handleGoogleClick}
      >
        <div className="flex items-center">
          <AiFillGoogleCircle className="h-6 w-6 mr-2 " />
          Continue with Google
        </div>
      </Button>
    </>
  );
};

export default OAuth;
