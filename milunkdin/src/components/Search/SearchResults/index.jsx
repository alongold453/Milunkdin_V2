import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import _ from "lodash";

const SearchResults = ({ searchText, skills, tags, reservists }) => {
  const navigate = useNavigate();

  const filteredPeopleByName = reservists.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const findSkillsIdsIncludesSearch = skills
    .filter((s) => s.name.toLowerCase().includes(searchText.toLowerCase()))
    .map((skill) => skill.id);
  const findTagsIdsIncludesSearch = tags
    .filter((t) => t.name.toLowerCase().includes(searchText.toLowerCase()))
    .map((tag) => tag.id);

  const findPeopleIdWithSkillId = reservists.filter((r) =>
    findSkillsIdsIncludesSearch.reduce(
      (agg, s) => agg || r.skills.map((x) => x.id).includes(s),
      false
    )
  );
  const findPeopleIdWithTagId = reservists.filter((r) =>
    findTagsIdsIncludesSearch.reduce(
      (agg, t) => agg || r.tags.map((x) => x.id).includes(t),
      false
    )
  );
  const filteredPeople = [
    ...new Set([
      ...filteredPeopleByName,
      ...findPeopleIdWithSkillId,
      ...findPeopleIdWithTagId,
    ]),
  ];

  const handleClick = (e) => {
    navigate(`/profile/${e.currentTarget.id}`);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {filteredPeople.length ? (
        filteredPeople.map((p) => {
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
                          style={{ marginLeft: "5px", marginTop: "5px" }}
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
          No results. You can allways ask Ofir for help.
        </ListItem>
      )}
    </List>
  );
};

export default SearchResults;
