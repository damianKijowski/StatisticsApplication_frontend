import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, CircularProgress, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const LeaguesList = ({onSelectLeague}) => {
    const [leagues, setLeagues] = useState([]); // To store league data
    const [favorites, setFavorites] = useState([]); // To store user's favorite leagues
    const [loading, setLoading] = useState(true); // To manage loading state
    const [error, setError] = useState(null); // To handle errors
    const user = JSON.parse(localStorage.getItem('user'));

// Fetch league data when component mounts
useEffect(() => {
    const fetchLeagues = async () => {
        try {
            const response = await axios.get('http://localhost:8080/competition'); // Replace with your API endpoint
            console.log(response.data);
            setLeagues(response.data); // Assuming response.data contains an array of leagues
            setLoading(false);
        } catch (err) {
            setError('Failed to load leagues.');
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/league/${user.id}`)
            console.log("FAVORITE league: " + JSON.stringify(response.data));
            setFavorites(response.data.map(fav => fav.leagueId))
            setLoading(false);
        }catch (err){
            setError('Failed to load leagues.');
            setLoading(false);
        }
    };
    fetchFavorites()
    fetchLeagues();
}, []); // Empty dependency array means this runs once after the component mounts
    if (loading) {
        return (
            <Paper elevation={3} style={{ padding: '20px', height: '100vh' }}>
                <CircularProgress />
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} style={{ padding: '20px', height: '100vh' }}>
                <p>{error}</p>
            </Paper>
        );
    }

    const toggleFavorite = async (leagueId) => {
        try {
            if (favorites.includes(leagueId)) {
                console.log("Included favorite: " + leagueId)
                await axios.delete(`http://localhost:8080/league/${user.id}/${leagueId}`);
                setFavorites(favorites.filter((id) => id !== leagueId));
            } else {
                await axios.post(`http://localhost:8080/league/addLeague/${user.id}/${leagueId}`, {
                    userId: user.id,
                    leagueId: leagueId,
                });
                setFavorites([...favorites, leagueId]); // Update state
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', height: '100vh', overflowY: 'auto' }}>
            <List>
                {leagues.map((league) => (
                    <ListItem button key={league.id} onClick={() => onSelectLeague(league.code)}>
                        <ListItemAvatar>
                            <Avatar
                                alt={league.name}
                                src={league.name === 'FIFA World Cup' ? league.emblem : league.area.flag}
                            />
                        </ListItemAvatar>
                        <ListItemText primary={league.name} />
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the onClick event of the ListItem
                                toggleFavorite(league.id);
                            }}
                        >
                            {favorites.includes(league.id) ? (
                                <StarIcon sx={{ color: 'gold' }} fontSize={'medium'}  />
                            ) : (
                                <StarBorderIcon fontSize={'medium'}/>
                            )}
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );



};
export default LeaguesList;