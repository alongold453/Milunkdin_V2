import React, { useState } from 'react'
import { Grid, TextField, Typography, Button } from '@mui/material'
import { addRervesHistory, addReservesHistory } from '../../api';
import { useFormik } from 'formik'
import { useParams } from "react-router-dom";
import { useMutation } from '@apollo/client';

const AddReservesDays = () => {
    const { personId } = useParams();
    const [addRervesHistoryHook,  {data, loading, error}] = useMutation(addReservesHistory)
    const [isSaveSuccess, setIsSaveSuccess] = useState(null)

    const formik = useFormik({
        initialValues: {
            daysNum: 0,
            rating: 0,
            description: '',
            month: 0,
            year: 0,
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            const { daysNum, rating, description, month, year } = values
            
            await addRervesHistoryHook({
                variables: {
                    days_num: daysNum,
                    description,
                    month,
                    rating,
                    reservist_id: personId,
                    year
                }
            })
            if (error) {
                setIsSaveSuccess(false)
            }
            else {
                setIsSaveSuccess(true)
            }
        },
    });

    return (
        <Grid container direction={'column'} justifyContent="center" alignItems="center" spacing={3} style={{ backgroundColor: '#f3f2ee', height: '100%' }}>
            <Grid item>
                <Typography variant="h3">הוסף ביקור מילואים</Typography>
            </Grid>
            <Grid item>
                <Grid container direction={'column'} justifyContent="center" alignItems="center" spacing={1}>
                    <Grid item>
                        <TextField
                            id="daysNum"
                            name="daysNum"
                            type={"number"}
                            value={formik.values.daysNum}
                            onChange={formik.handleChange}
                            label="מספר ימים"
                        />
                      
                    </Grid>
                    <Grid item>
                    <TextField
                            id="rating"
                            name="rating"
                            type={"number"}
                            value={formik.values.rating}
                            onChange={formik.handleChange}
                            label="דירוג (1 - 10)"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="year"
                            name="year"
                            value={formik.values.year}
                            onChange={formik.handleChange}
                            type={"number"}
                            label="שנה" />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="month"
                            name="month"
                            type={"number"}
                            value={formik.values.month}
                            onChange={formik.handleChange}
                            label="חודש"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            label="תיאור"
                        />
                    </Grid>
                    <Grid item>
                        <Button onClick={formik.handleSubmit}>הוספה</Button>
                    </Grid>
                    {isSaveSuccess !== null &&
                        <Grid item>
                            {isSaveSuccess ? 'נשמר בהצלחה' : 'נכשל בשמירה'}
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export default AddReservesDays