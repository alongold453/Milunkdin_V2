import React, { useState } from "react";
import { Grid, TextField, Typography, Button } from "@mui/material";
import { createReserver } from "../../api";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";

const Manage = () => {
  const [isSaveSuccess, setIsSaveSuccess] = useState(null);
  const [userData] = useContext(UserContext);
  const [createReserverHook, { data, loading, error }] =
    useMutation(createReserver);
  const formik = useFormik({
    initialValues: {
      linkedinName: "",
      linkedinURL: "",
      name: "",
      rank: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { linkedinName, linkedinURL, name, rank } = values;
      await createReserverHook({
        variables: { linkedinName, linkedinURL, name, rank },
      });
      if (error) {
        setIsSaveSuccess(false);
      } else {
        setIsSaveSuccess(true);
      }
    },
  });

  return (
    <>
      {!userData.roles.includes("mador_manager") ? (
        <>אין לך הרשאה למסך זה</>
      ) : (
        <Grid
          container
          direction={"column"}
          justifyContent="center"
          alignItems="center"
          spacing={3}
          style={{ backgroundColor: "#f3f2ee", height: "100%" }}
        >
          <Grid item>
            <Typography variant="h3">גייס מילואמניק</Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction={"column"}
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <TextField
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  label="שם"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="linkedinName"
                  name="linkedinName"
                  value={formik.values.linkedinName}
                  onChange={formik.handleChange}
                  label="שם בלינקדאין"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="rank"
                  name="rank"
                  value={formik.values.rank}
                  onChange={formik.handleChange}
                  label="דרגה"
                />
              </Grid>
              {/* <Grid item>
                <TextField
                  id="imageUrl"
                  name="imageUrl"
                  value={formik.values.imageUrl}
                  onChange={formik.handleChange}
                  label="תמונה (לינק)"
                />
              </Grid> */}
              <Grid item>
                <Button onClick={formik.handleSubmit}>לזמן דחוף</Button>
              </Grid>
              {isSaveSuccess !== null && (
                <Grid item>
                  {isSaveSuccess ? "נשמר בהצלחה" : "נכשל בשמירה"}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Manage;
