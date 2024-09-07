import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navaigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setTimeout(() => {
        setLoading(false);
        setErrorMessage(false);
      }, 3000);
      return setErrorMessage("Please fill out all fields !");
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success === false) {
        setTimeout(() => {
          setLoading(false);
          setErrorMessage(null);
        }, 3000);
        return setErrorMessage(result.message);
      } else {
        setTimeout(() => {
          setLoading(false);
          setErrorMessage(null);
          navaigate("/sign-in");
        }, 3000);
        return setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setFormData({
      username: "",
      email: "",
      password: "",
    });
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
              This is a demo project you can sign up with your email and
              password or with Google.
            </p>
          </div>
          {/* Right */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div>
                <Label value="your username" />
                <TextInput
                  type="text"
                  placeholder="Username "
                  id="username"
                  name="username"
                  onChange={handleChange}
                />
              </div>
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
                  placeholder="Password "
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
                    "Sign Up"
                  )}
                </Button>
              </div>
              <OAuth />
            </form>
            <div className="flex gap-3 text-sm mt-5">
              <span>Have an account?</span>
              <Link to="/sign-in" className="text-blue-500 font-bold">
                Sign In
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

export default SignUp;
