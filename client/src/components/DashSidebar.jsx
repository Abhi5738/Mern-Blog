import React from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";

const DashSidebar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        dispatch(signOutSuccess(result));
      }
    } catch (error) {
      console.log("Error :", error.message);
    }
  };
  return (
    <>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            {currentUser && currentUser.isAdmin && (
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as="div"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )}
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
            )}

            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
            )}

            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            )}

            <Sidebar.Item
              onClick={handleSignOut}
              icon={HiArrowSmRight}
              className="cursor-pointer"
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

export default DashSidebar;
