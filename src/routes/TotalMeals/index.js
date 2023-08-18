import classes from './index.module.css';
import { Button, Space, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import WeekMenu from '../../components/WeekMenu';

export default function TotalMealsPage() {
    const [thisweek, setthisweek] = useState(true);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
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
                const response = await axios.post(window.APIROOT + 'api/admin/meals', { week: thisweek ? "this" : "next" } , {
                    withCredentials: true, // Important: Set this to true
                          headers: {
                            Cookie: cookies,
                          },
                  });
                setMenu(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch menu from server');
            }
        }
        fetchData();
    }, [thisweek]);

    return (
        <div className={classes.menuBody}>
            <div className={classes.buttons}>
                <Space>
                    <Button disabled={thisweek} type='primary' size='large' onClick={() => setthisweek(true)}>This Week</Button>
                    <Button disabled={!thisweek} type='primary' size='large' onClick={() => setthisweek(false)}>Next Week</Button>
                </Space>
            </div>
            <h1>{thisweek ? "Total Meals This Week" : "Total Meals Next Week"}</h1>
            <WeekMenu loading={loading} menu={menu} mobile={false} />
        </div >
    );
}