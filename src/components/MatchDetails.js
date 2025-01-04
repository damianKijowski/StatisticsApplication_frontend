import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Box,
    Grid,
    Paper,
} from '@mui/material';

const MatchDetails = ({ matchId, loggedInUser }) => {
    const [matchDetails, setMatchDetails] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    // Fetch match details
    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/matches/${matchId}`);
                setMatchDetails(response.data);
            } catch (error) {
                console.error('Error fetching match details:', error);
            }
        };

        fetchMatchDetails();
    }, [matchId]);

    // Fetch match prediction
    useEffect(() => {
        const getMatchPrediction = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/prediction/match/${matchId}`);
                if (response.data) {
                    setPrediction(response.data.prediction);
                }
            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        };

        getMatchPrediction();
    }, [matchId]);

    // Fetch comments for the match
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/comments/${matchId}`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [matchId]);

    // Function to handle comment submission
    const handleCommentSubmit = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('You must be logged in to comment');
            return;
        }

        const newComment = {
            userId: user.email,
            matchId: matchId,
            content: comment,
        };

        try {
            await axios.post('http://localhost:8080/comments', newComment);
            setComments([...comments, { userId: user.email, content: comment }]);
            setComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const setMatchPrediction = async (newPrediction) => {
        const data = {
            prediction: newPrediction,
            matchId,
        };

        try {
            if (prediction !== null) {
                await axios.put(`http://localhost:8080/prediction`, data);
            } else {
                await axios.post(`http://localhost:8080/prediction`, data);
            }
            setPrediction(newPrediction);
        } catch (error) {
            console.error('Error setting prediction:', error);
        }
    };

    if (!matchDetails) return <Typography>Loading match details...</Typography>;

    return (
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
            <Typography variant="h4" gutterBottom>
                Match Details
            </Typography>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <img src={matchDetails.homeTeam.crest} alt={matchDetails.homeTeam.name} style={{ width: '100px' }} />
                    <Typography variant="h6">{matchDetails.homeTeam.name}</Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <Typography variant="h5">
                        {matchDetails.score.fullTime.home} - {matchDetails.score.fullTime.away}
                    </Typography>
                    <Typography>{new Date(matchDetails.utcDate).toLocaleString()}</Typography>
                    <Typography>Status: {matchDetails.status}</Typography>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <img src={matchDetails.awayTeam.crest} alt={matchDetails.awayTeam.name} style={{ width: '100px' }} />
                    <Typography variant="h6">{matchDetails.awayTeam.name}</Typography>
                </Grid>
            </Grid>

            {/* Prediction Section */}
            <Box mt={4} textAlign="center">
                <Typography variant="h5" gutterBottom>
                    Who will win?
                </Typography>
                <Box display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant={prediction === 1 ? 'contained' : 'outlined'}
                        color={prediction === 1 ? 'success' : 'primary'}
                        onClick={() => setMatchPrediction(1)}
                    >
                        {matchDetails.homeTeam.name}
                    </Button>
                    <Button
                        variant={prediction === 0 ? 'contained' : 'outlined'}
                        color={prediction === 0 ? 'success' : 'primary'}
                        onClick={() => setMatchPrediction(0)}
                    >
                        Draw
                    </Button>
                    <Button
                        variant={prediction === 2 ? 'contained' : 'outlined'}
                        color={prediction === 2 ? 'success' : 'primary'}
                        onClick={() => setMatchPrediction(2)}
                    >
                        {matchDetails.awayTeam.name}
                    </Button>
                </Box>
                {prediction !== null && (
                    <Typography mt={2} color="green">
                        You predicted: {prediction === 1
                        ? matchDetails.homeTeam.name
                        : prediction === 2
                            ? matchDetails.awayTeam.name
                            : 'Draw'}
                    </Typography>
                )}
            </Box>

            {/* Comments Section */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Comments
                </Typography>
                <Box
                    sx={{
                        maxWidth: '50%',
                        maxHeight: '300px',
                        margin: '0 auto',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    {comments.map((comment, idx) => (
                        <Paper
                            key={idx}
                            elevation={2}
                            sx={{
                                mb: 1,
                                p: 2,
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                            }}
                        >
                            <Typography variant="subtitle2" color="textSecondary">
                                {comment.userId}
                            </Typography>
                            <Typography variant="body2">{comment.content}</Typography>
                        </Paper>
                    ))}
                </Box>

                <Box mt={2} sx={{ maxWidth: '50%', margin: '0 auto' }}>
                    <TextField
                        fullWidth
                        label="Add a comment"
                        multiline
                        rows={2}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCommentSubmit}
                        sx={{ mt: 2 }}
                    >
                        Submit Comment
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default MatchDetails;
