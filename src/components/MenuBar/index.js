import classes from "./index.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Fade from "../../utility/fade";
import axios from "axios";
import {
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  TableOutlined,
  SettingOutlined,
  SolutionOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";

// Create and send a menu item with relative link
const getItem = (label, link, icon, key) => {
  console.log("getItem", label, link, icon, key);
  return (
    <Menu.Item key={key} icon={icon}>
      <Link to={link}>{label}</Link>
    </Menu.Item>
  );
};

// Create and send a menu item with absolute link needed for signin and signout
const getLoginItem = (label, link, icon, key) => {
  console.log("getLoginItem", label, link, icon, key);
  return (
    <Menu.Item key={key} icon={icon}>
      <a href={link}>{label}</a>
    </Menu.Item>
  );
};

export default function MenuBar() {
  const [open, setopen] = useState(false);
  const [status, setStatus] = useState(false);


  // Get all cookies
const allCookies = document.cookie;
console.log("All Cookies:", allCookies);

// Function to get a specific cookie by name
const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for(let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
}

  // On load, get the loggedin and admin status and render the menu accordingly
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = getCookie("connect.sid");
        const response = await axios.get(window.APIROOT + "api/data/status", {
          withCredentials: true, // Important: Set this to true
          headers: {
            Cookie: cookies,
          },});
        console.log({response:response})
        setStatus(response.data);
      } catch (error) {
        message.error("Failed to fetch data from server");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={classes.menu}>
        <div className={classes.logo}>
          <span>Mess Portal</span>
        </div>
        <motion.div
          className={classes.navWrap}
          animate={{ x: open ? 0 : "-15rem" }}
          transition={{ duration: 0.3 }}
        >
          <Menu
            className={classes.nav}
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            onClick={() => setopen(!open)}
          >
            {
              <>
                {getLoginItem(
                  status.loggedIn ? "Sign out" : "Sign in",
                  status.loggedIn ? "http://localhost:8000/api/auth/signout" : "http://localhost:8000/api/auth/signin",
                  <UserOutlined />,
                  "2"
                )}
                {status.loggedIn ? (
                  <>
                    <Menu.Divider />
                    {getItem("Schedule", "/", <TableOutlined />, "3")}
                    {getItem(
                      "Buy coupons",
                      "/buy-coupons",
                      <ShoppingCartOutlined />,
                      "4"
                    )}
                    {getItem(
                      "Purchase history",
                      "/purchase-history",
                      <CalendarOutlined />,
                      "5"
                    )}
                    {getItem("QR code", "/qr-code", <QrcodeOutlined />, "6")}
                    {status.admin ? (
                      <>
                        <Menu.Divider />
                        {getItem(
                          "Admin panel",
                          "/admin",
                          <SettingOutlined />,
                          "7"
                        )}
                        {getItem(
                          "Total meals",
                          "/total-meals",
                          <SolutionOutlined />,
                          "8"
                        )}
                        {getItem(
                          "Scan QR code",
                          "/scan-qr",
                          <ScanOutlined />,
                          "9"
                        )}
                      </>
                    ) : null}
                  </>
                ) : null}
              </>
            }
          </Menu>
          <div className={classes.navBtn} onClick={() => setopen(!open)}>
            {
              <Fade
                one2Two={open}
                one={<CloseOutlined />}
                two={<MenuOutlined />}
              />
            }
          </div>
          <div className={classes.logoCover}></div>
        </motion.div>
      </div>
      <div className={classes.gap} />
    </>
  );
}
