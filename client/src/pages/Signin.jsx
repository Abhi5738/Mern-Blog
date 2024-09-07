import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navaigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setErrorMessage(null);
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill out all fields !");
      setTimeout(() => {
        setLoading(false);
        setErrorMessage(null);
      }, 3000);
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success === false) {
        setErrorMessage(result.message);
        setTimeout(() => {
          setLoading(false);
          setErrorMessage(null);
        }, 3000);
        return;
      }

      if (response.ok) {
        dispatch(signInSuccess(result));
        navaigate("/");
        setLoading(false);
        return;
      }
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      setErrorMessage("Internal Server Error");
      setTimeout(() => {
        setLoading(false);
        setErrorMessage(null);
      }, 3000);
      console.log("SignIn Error : ", error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex mx-auto p-3 max-w-3xl flex-col md:flex-row md:items-center gap-5">
          {/* Left */}
          <div className="flex-1">
            <Link to="" className=" font-bold dark:text-white text-4xl">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Sahand's
              </span>
              Blog
            </Link>
            <p className="text-sm mt-5 font-bold">
              This is a demo project you can sign in with your email and
              password or with Google.
            </p>
          </div>
          {/* Right */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div>
                <Label value="your email" />
                <TextInput
                  type="email"
                  placeholder="Email "
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="your Password" />
                <TextInput
                  type="password"
                  placeholder="********* "
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Button
                  gradientDuoTone="purpleToPink"
                  type="submit"
                  className="w-full mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">loading...</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
              <OAuth />
            </form>
            <div className="flex gap-3 text-sm mt-5">
              <span className="font-bold"> Don't have an account?</span>
              <Link to="/sign-up" className="text-blue-500 font-bold">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
