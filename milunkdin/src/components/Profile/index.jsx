import "./index.css";
import Timeline from "./Timeline";
import Skills from "./Skills";
import { Button, Chip, TextField, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  reservistById,
  insertMadorReservist,
  insertTag,
  getFavoriteById,
  insertFavoriteReservist,
  deleteFavoriteReservist
} from "../../api";
import { useQuery, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { UserContext } from "../../context/user.context";
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

const Profile = () => {
  const { personId } = useParams();
  const [userData] = useContext(UserContext);
  const [newTag, setNewTag] = useState("");
  const profileHook = useQuery(reservistById, {
    variables: {
      id: personId,
    }, fetchPolicy: 'cache-and-network'
    
  });
  const isFavoriteHook = useQuery(getFavoriteById, {
    variables: {
      reservist_id: personId,
    },
  });
  const isFavorite = isFavoriteHook.data
    ? isFavoriteHook.data.favorites_reservists.length !== 0
    : false;
  const [addMadorReservistHook, { data, loading, error }] =
    useMutation(insertMadorReservist, { refetchQueries: ['getReservistById']});
  const [addTagHook] = useMutation(insertTag);
  const [addFavoriteReservist] = useMutation(insertFavoriteReservist)
  const [deleteFavoriteReservistHook] = useMutation(deleteFavoriteReservist)
  const addTag = async (reservist_id, name) => {
    await addTagHook({
      variables: {
        reservist_id: reservist_id,
        name: name,
      },
      refetchQueries: ["getReservistById"],
    });
  };
  const handleDeleteFavorite = () => {
    deleteFavoriteReservistHook({
      variables: {
        reservist_id: personId
      },
      refetchQueries: [
        'get_favorite_by_id'
      ]
    })
  }
  const handleAddFavoriteReservist = () => {
    addFavoriteReservist({
      variables: {
        reservist_id: personId,
        user_id: userData.user_id
      },
      refetchQueries: ['get_favorite_by_id']
    })
  }
  const handleAddReservist = async (reservist_id, mador_id) => {
    await addMadorReservistHook({
      variables: {
        mador_id: mador_id,
        reservist_id: reservist_id,
      },
    });
  };
  const handleClick = () => {
    handleAddReservist(personId, userData.mador_id);
  };

  const handleAddTag = () => {
    addTag(personId, newTag);
  };
  const handleChangeTagName = (e) => {
    setNewTag(e.currentTarget.value);
  };
  const profile = profileHook.data ? profileHook.data.reservist : undefined;
  const mador =
    profile && profile.mador && profile.mador.length !== 0
      ? profile.mador[0].mador_id
      : undefined;
  const currentRole = profile
    ? profile.experiences.find((x) => x.end_date === null)
    : undefined;

  return profile ? (
    <div className="profile-container">
      <div className="profile-background"></div>
      <img className="profile-img" src={profile ? profile.image_url : ""}></img>
      <div className="profile-details">
        <div className="profile-name">{profile ? profile.name : ""}</div>
        <div className="profile-current-role">
          {currentRole
            ? currentRole.role + " at " + currentRole.company
            : "unemployed"}
        </div>
        {isFavorite ? (
          <Button onClick={handleDeleteFavorite}>
            <StarIcon style={{ color: "yellow" }} />
          </Button>
        ) : (
          <Button onClick={handleAddFavoriteReservist}>
            <StarBorderOutlinedIcon style={{ color: "yellow" }} />
          </Button>
        )}
        <Tags tags={profile.tags} />
        {(mador && mador !== userData.mador_id) || !mador ? (
          <Button
            variant="contained"
            sx={{ marginBottom: "15px" }}
            onClick={handleClick}
          >
            הוספה למדור שלי
          </Button>
        ) : (
          <>
            <TextField
              id="new-tag"
              label="הוספת תגית"
              variant="outlined"
              onChange={handleChangeTagName}
              value={newTag}
            />
            <Button onClick={handleAddTag}>הוסף</Button>
          </>
        )}
        <div className="border"></div>
        <div className="profile-skills">
          <Skills
            skills={profile.skills.map((s) => ({
              text: s.name,
              value: s.score,
            }))}
          />
        </div>
        <div className="border"></div>
        <Timeline
          experienceArray={profile.experiences.concat(
            profile.reserves_histories
          )}
          personId={personId}
        ></Timeline>
      </div>
    </div>
  ) : (
    <div />
  );
};

const Tags = ({ tags }) => {
  return (
    <div className="profile-tags">
      {tags.map((tag) => (
        <Chip key={tag.id} label={tag.name} className="profile-tags-tag"></Chip>
      ))}
    </div>
  );
};

export default Profile;
