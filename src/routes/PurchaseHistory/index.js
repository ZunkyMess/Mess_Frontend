import classes from "./index.module.css";
import { Button, Space, message } from "antd";
import { useMediaQuery } from "react-responsive";
import WeekMenu from "../../components/WeekMenu";
import axios from "axios";
import { useState, useEffect } from "react";

export default function PurchaseHistoryPage() {
  const mobile = useMediaQuery({ query: "(max-width: 750px)" });
  const [thisweek, setthisweek] = useState(true);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cookies = getCookie("connect.sid");
        const response = await axios.get(window.APIROOT + "api/data/menu");
        const buyer = await axios.get(window.APIROOT + "api/user/data" , {
          withCredentials: true, // Important: Set this to true
                headers: {
                  Cookie: cookies,
                },
        });
        console.log(response, buyer);
        let data = [];
        console.log("olddata", data);
        for (let r of response.data) {
          data.push({
            day: r.day,
            breakfast: {
              text: r.breakfast,
              selected:
                buyer.data[thisweek ? "this" : "next"][r.day.toLowerCase()]
                  .breakfast,
            },
            lunch: {
              text: r.lunch,
              selected:
                buyer.data[thisweek ? "this" : "next"][r.day.toLowerCase()]
                  .lunch,
            },
            dinner: {
              text: r.dinner,
              selected:
                buyer.data[thisweek ? "this" : "next"][r.day.toLowerCase()]
                  .dinner,
            },
          });
          //   console.log("running");
        }
        // console.log("newdata", data);
        setMenu(data);
        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch purchase history from server");
      }
    };
    fetchData();
  }, [thisweek]);

  //   useEffect(() => {
  //     console.log("useeffect ran", menu);
  //   }, [menu, loading]);

  return (
    <div className={classes.menuBody}>
      <div className={classes.buttons}>
        <Space>
          <Button
            disabled={thisweek}
            type="primary"
            size="large"
            onClick={() => setthisweek(true)}
          >
            This Week
          </Button>
          <Button
            disabled={!thisweek}
            type="primary"
            size="large"
            onClick={() => setthisweek(false)}
          >
            Next Week
          </Button>
        </Space>
      </div>
      <h1>{thisweek ? "Your Coupons This Week" : "Your Coupons Next Week"}</h1>
      <WeekMenu loading={loading} menu={menu} mobile={mobile} highlight />
    </div>
  );
}
