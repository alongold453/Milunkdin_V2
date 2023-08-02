import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from "react";
import './index.css';
import SearchResults from './SearchResults'
import { Grid, Typography } from '@mui/material'
import { useAnimate } from 'react-simple-animate';
import React, { useEffect, useContext } from 'react';
import { getAllReservists, getAllSkills, getAllTags, reservistById } from '../../api'
import { useQuery } from '@apollo/client'

export default () => {
    const [searchText, setSearchText] = useState('')

    const { style: headerTransitionStyle, play: playHeaderTransition } = useAnimate({ start: { marginTop: 'calc(50vh - 30px - 130px)' }, end: { marginTop: 0 } });
    const allResevists = useQuery(getAllReservists)
    const reservists = allResevists.data ? allResevists.data.reservists : [] 
    const allTags = useQuery(getAllTags)
    const tags = allTags.data ? allTags.data.tags.nodes : []
    const allSkills = useQuery(getAllSkills)
    const skills = allSkills.data ? allSkills.data.skills.nodes : []

    useEffect(() => {
        playHeaderTransition(searchText)
    }, [searchText])

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className="container" style={{ height: '100%' }}>
            <Grid container direction="column" justify="center" align="center" spacing={2} style={{margin: 0 }}>
                <Grid item style={headerTransitionStyle}>
                    <Typography variant='h2'>המילואימניקים</Typography>


                    <input
                        style={{ width: matches ? 350 : 700, marginTop: 30 }}
                        className="search-input"
                        placeholder="חפש מילואימניק"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </Grid>


                <Grid item>
                    {searchText && <SearchResults searchText={searchText} skills={skills} tags={tags} reservists={reservists} />}
                </Grid>
            </Grid>
        </div>
    )
}