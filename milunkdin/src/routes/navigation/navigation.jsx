import { Link, Outlet } from "react-router-dom";
import "./navigation.styles.scss";
import { UserContext } from "../../context/user.context.js";
import { useContext, useState } from "react";
import { getAllMyFavorites } from "../../api";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";


const Navigation = () => {
  const [userData] = useContext(UserContext);
  const favoriteHook = useQuery(getAllMyFavorites);
  const myFavoriteList = favoriteHook.data
    ? favoriteHook.data.favorites_reservists
    : [];
  const lastEntered = myFavoriteList.length
    ? myFavoriteList[0].last_entered
    : null;
  const [newUpdates, setNewUpdates] = useState(0)
  useEffect(() => {
    const lastEnteredFormat = new Date(lastEntered);
    if (myFavoriteList.length) {
      myFavoriteList.forEach((favorite) => {
        const lastUpdateFormat = new Date(favorite.reservist.last_update_date);
        if (lastUpdateFormat > lastEnteredFormat) {
          setNewUpdates(newUpdates + 1);
        }
      });
    }
  }, [myFavoriteList]);
  return (
    <>
      <div className="navigation">
        <div className="nav-links-container">
          <Link className="nav-link" to="/mymador">
            המדור שלי
          </Link>
          <Link className="nav-link" to="/search">
            חיפוש אנשי מילואים
          </Link>
          {userData.roles.includes("mador_manager") && (
            <Link className="nav-link" to="/users">
              חיפוש משתמשים
            </Link>
          )}
          {userData.roles.includes("mador_manager") && (
            <Link className="nav-link" to="/manage">
              הוספת אנשי מילואים למעקב
            </Link>
          )}
          <Link className="nav-link" to="/stats">
            סטטיסטיקה
          </Link>
          <Badge
            badgeContent={newUpdates}
            color="primary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Link className="nav-link" to="/favorites">
              המועדפים שלי
            </Link>
          </Badge>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
