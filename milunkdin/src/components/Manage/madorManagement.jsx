import { useQuery, useMutation } from "@apollo/client";
import {
  getMyMadorReservists,
  getMyMadorMembers,
  getMyMadorManagers,
  deleteMadorReservist,
  deleteMadorMembers
} from "../../api";
import {
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const MadorManagement = () => {
  const navigate = useNavigate();
  const [userData] = useContext(UserContext);
  const [deleteReservistMadorHook] = useMutation(deleteMadorReservist);
  const [deleteMadorMemberHook] = useMutation(deleteMadorMembers)
  const madorReservists = useQuery(getMyMadorReservists, { fetchPolicy: 'cache-and-network' });
  const madorMembers = useQuery(getMyMadorMembers, { fetchPolicy: 'cache-and-network' });
  const madorManagers = useQuery(getMyMadorManagers, {
    variables: {
      manager_id: userData.user_id,
    }
  });

  const reservistsList = madorReservists.data
    ? madorReservists.data.mador_reservists
    : [];
  const memberList = madorMembers.data ? madorMembers.data.mador_members : [];
  const managerList = madorManagers.data
    ? madorManagers.data.mador_managers
    : [];
  console.log("managerList", managerList);
  const handleClick = (e) => {
    navigate(`/profile/${e.currentTarget.id}`);
  };
  const handleDeleteReservist = (e) => {
    deleteReservistMadorHook({
      variables: { reservist_id: e.currentTarget.id },
      refetchQueries: ["get_my_mador_reservists"],
    });
  };

  const handleDeleteMember = (e) => {
    deleteMadorMemberHook({
      variables: { user_id: e.currentTarget.id },
      refetchQueries: ["get_my_mador_members"],
    });
  };

  return (
    <Grid container justifyContent={"space-around"}>
      <Grid item>
        <Typography variant="h4">אנשי המילואים שלנו</Typography>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {reservistsList.length ? (
            reservistsList.map((p1) => {
              const p = p1.reservist;
              const skillsInfo = p.skills;
              const tagsInfo = p.tags;

              const firstSkills = skillsInfo.slice(0, 3);
              const moreSkillsCount = skillsInfo.length - 3;

              return (
                <Grid container>
                  <Grid item>
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
                  </Grid>
                  <Grid item>
                    <ListItemButton id={p.id} onClick={handleDeleteReservist}>
                      <DeleteIcon style={{ color: "red" }} />
                    </ListItemButton>
                  </Grid>
                </Grid>
              );
            })
          ) : (
            <ListItem alignItems="flex-start" dir="ltr">
              לא נמצאו אנשי מילואים משוייכים למדור
            </ListItem>
          )}
        </List>
      </Grid>
      {userData.roles.includes("mador_manager") && (
        <Grid item>
          <Typography variant="h4">מנהלי המדור</Typography>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {managerList.length !== 0 ? (
              managerList.map((managerObj) => {
                const manager = managerObj.mador_manager_user;
                return (
                  <ListItem key={manager.id}>
                    <ListItemText
                      primary={manager.name}
                      secondary={manager.email}
                    ></ListItemText>
                  </ListItem>
                );
              })
            ) : (
              <ListItem alignItems="flex-start" dir="ltr">
                לא נמצאו מנהלי מדור נוספים
              </ListItem>
            )}
          </List>
        </Grid>
      )}
      {userData.roles.includes("mador_manager") && (
        <Grid item>
          <Typography variant="h4">חברי המדור</Typography>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {console.log(memberList)}
            {memberList.length !== 0 ? (
              memberList.map((memberObj) => {
                const member = memberObj.member;
                return (
                  <ListItem key={member.user_id}>
                    <ListItemText
                      primary={member.name}
                      secondary={member.email}
                    ></ListItemText>
                     <ListItemButton id={member.user_id} onClick={handleDeleteMember}>
                        <DeleteIcon style={{ color: "red" }} />
                    </ListItemButton>
                  </ListItem>
                );
              })
            ) : (
              <ListItem alignItems="flex-start" dir="ltr">
                לא נמצאו חברי מדור
              </ListItem>
            )}
          </List>
        </Grid>
      )}
    </Grid>
  );
};

export default MadorManagement;
