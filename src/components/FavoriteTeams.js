import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import axios from 'axios';

const FavoriteTeams = ({ onTeamClick }) => {
    const [favoriteTeams, setFavoriteTeams] = useState([]);

    // Fetch favorite teams
    useEffect(() => {
        const fetchFavoriteTeams = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`http://localhost:8080/favTeam/${user.id}`);
                setFavoriteTeams(response.data);
            } catch (error) {
                console.error('Error fetching favorite teams:', error);
            }
        };
        fetchFavoriteTeams();
    }, []);

    return (
        <Box
            sx={{
                padding: '10px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                height: '100%',
                overflowY: 'auto', // Add scroll if the list gets too long
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Favorite Teams
            </Typography>
            {favoriteTeams.length > 0 ? (
                favoriteTeams.map((team) => (
                    <Card
                        key={team.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: 'none',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            margin: '10px',
                            height: '60px'
                        }}
                        onClick={() => onTeamClick(team.id)}
                    >
                        <CardMedia
                            component="img"
                            image={team.crest}
                            alt={team.name}
                            sx={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'contain',
                                margin: '10px',
                            }}
                        />
                        <CardContent

                        >
                            <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>
                                {team.name}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#757575' }}>
                    No favorite teams found.
                </Typography>
            )}
        </Box>
    );
};

export default FavoriteTeams;
