import { useQuery, useMutation } from "@apollo/client";
import { getAllUsers } from "../../api";
import { List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { insertMadorMember } from "../../api";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
const AllUsersList = () => {
  const [userData] = useContext(UserContext);
  const allUsersData = useQuery(getAllUsers, {fetchPolicy: 'cache-and-network'});

  const usersList = allUsersData.data ? allUsersData.data.users : [];
  const [addMadorMemberHook, { data, loading, error }] =
    useMutation(insertMadorMember);
  const handleAddUser = async (userId, madorId) => {
    await addMadorMemberHook({
      variables: {
        mador_id: madorId,
        user_id: userId,
      },
      refetchQueries: [
         'get_all_users'
      ]     
    });
  };
  const handleClick = (e) => {
    handleAddUser(e.currentTarget.id, userData.mador_id);
  };

  return (
    <>
      {!userData.roles.includes("mador_manager") ? (<>
        <Typography variant="h4">
            אין לך הרשאה למסך זה
        </Typography>
      </>) :  (
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            margin: "auto auto auto auto",
            bgcolor: "background.paper",
          }}
        >
          {usersList.length !== 0 ? (
            usersList.map((user) => {
              return (
                <ListItem key={user.user_id} id={user.user_id}>
                  <ListItemButton
                    id={user.user_id}
                    onClick={handleClick}
                    sx={{ color: "blue" }}
                  >
                    הוסף למדור שלי!
                  </ListItemButton>
                  <ListItemText primary={user.name} secondary={user.email} />
                </ListItem>
              );
            })
          ) : (
            <ListItem>לא נמצאו משתמשים שאינם משוייכים לאף מדור</ListItem>
          )}
        </List>
      )}
    </>
  );
};

export default AllUsersList;
