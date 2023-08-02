import { useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { UserContext } from "../../context/user.context";
import { getAllMyFavorites, updateLastEnteredFavorite } from "../../api";
import {
  List,
  ListItemText,
  ListItem,
  ListItemAvatar,
  Grid,
  Avatar,
  Chip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import _, { now } from "lodash";
import { useEffect } from "react";
const FavoriteList = () => {
  const [userData] = useContext(UserContext);
  const favoriteHook = useQuery(getAllMyFavorites, { fetchPolicy: 'cache-and-network' });
  const myFavoriteList = favoriteHook.data
    ? favoriteHook.data.favorites_reservists
    : [];
  const lastEntered = myFavoriteList.length
    ? myFavoriteList[0].last_entered
    : null;
  const [updateLastEntered] = useMutation(
    updateLastEnteredFavorite
  );
  useEffect(() => {
    if (myFavoriteList.length) {
      updateLastEntered({
        variables: {
          user_id: userData.user_id,
        },
      });
    }
  }, [myFavoriteList]);
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate(`/profile/${e.currentTarget.id}`);
  };
  return (
    <>
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <Typography variant="h5">מועדפים שהתעדכנו לאחרונה</Typography>
          {(userData.roles[0]?.includes("mador_member") ||
            userData.roles[0]?.includes("mador_manager")) && (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {myFavoriteList.length ? (
                myFavoriteList.map((p1) => {
                  const reservist = p1.reservist;
                  const lastUpdateFormat = new Date(reservist.last_update_date)
                  const lastEnteredFormat = new Date(lastEntered) 
                  if (lastUpdateFormat < lastEnteredFormat) {
                    return <></>;
                  } else {
                    const skillsInfo = reservist.skills;
                    const tagsInfo = reservist.tags;
                    const firstSkills = skillsInfo.slice(0, 3);
                    const moreSkillsCount = skillsInfo.length - 3;
                    return (
                      <ListItem
                        key={reservist.id}
                        alignItems="flex-start"
                        id={reservist.id}
                        onClick={handleClick}
                        style={{ cursor: "pointer" }}
                      >
                        <ListItemAvatar>
                          <Avatar alt={`${reservist.name}-img`} src={reservist.image_url} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={reservist.name}
                          secondary={
                            <Grid container direction="column">
                              <Grid item>
                                {_.join(
                                  firstSkills.map((skill) => skill.name),
                                  ", "
                                )}
                                {moreSkillsCount > 0
                                  ? " And " + moreSkillsCount + " More"
                                  : ""}
                              </Grid>

                              <Grid item>
                                {tagsInfo.map((tag) => (
                                  <Chip
                                    style={{
                                      marginLeft: "5px",
                                      marginTop: "5px",
                                    }}
                                    size="small"
                                    label={tag.name}
                                    className="chip"
                                  />
                                ))}
                              </Grid>
                            </Grid>
                          }
                        />
                      </ListItem>
                    );
                  }
                })
              ) : (
                <ListItem alignItems="flex-start" dir="ltr">
                  לא נמצאו אנשי מילואים משוייכים למדור
                </ListItem>
              )}
            </List>
          )}
        </Grid>
        <Grid item>
          <Typography variant="h5">כל המועדפים</Typography>
          {(userData.roles[0]?.includes("mador_member") ||
            userData.roles[0]?.includes("mador_manager")) && (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {myFavoriteList.length ? (
                myFavoriteList.map((p1) => {
                  console.log("p1", p1);
                  const p = p1.reservist;
                  const skillsInfo = p.skills;
                  const tagsInfo = p.tags;
                  const firstSkills = skillsInfo.slice(0, 3);
                  const moreSkillsCount = skillsInfo.length - 3;
                  return (
                    <ListItem
                      key={p.id}
                      alignItems="flex-start"
                      id={p.id}
                      onClick={handleClick}
                      style={{ cursor: "pointer" }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={`${p.name}-img`} src={p.image_url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={p.name}
                        secondary={
                          <Grid container direction="column">
                            <Grid item>
                              {_.join(
                                firstSkills.map((skill) => skill.name),
                                ", "
                              )}
                              {moreSkillsCount > 0
                                ? " And " + moreSkillsCount + " More"
                                : ""}
                            </Grid>

                            <Grid item>
                              {tagsInfo.map((tag) => (
                                <Chip
                                  style={{
                                    marginLeft: "5px",
                                    marginTop: "5px",
                                  }}
                                  size="small"
                                  label={tag.name}
                                  className="chip"
                                />
                              ))}
                            </Grid>
                          </Grid>
                        }
                      />
                    </ListItem>
                  );
                })
              ) : (
                <ListItem alignItems="flex-start" dir="ltr">
                  לא נמצאו אנשי מילואים משוייכים למדור
                </ListItem>
              )}
            </List>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default FavoriteList;
