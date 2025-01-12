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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MatchDetails = ({ matchId, loggedInUser }) => {
    const [matchDetails, setMatchDetails] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showLineup, setShowLineup] = useState(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

    // Fetch match details
    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/matches/${matchId}`);
                setMatchDetails(response.data);
                console.log("DATA: " + JSON.stringify(response.data));
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
            email: user.email,
            matchId: matchId,
            content: comment,
        };

        try {
            const timeNow = getNowTimeArray();
            await axios.post('http://localhost:8080/comments', newComment);
            setComments([...comments, { userName: user.name, content: comment, createdAt: timeNow }]);
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

    const formatDateFromArray = (dateArray) => {
        if (!Array.isArray(dateArray) || dateArray.length < 6) {
            return 'Invalid Date';
        }

        const [year, month, day, hours, minutes, seconds] = dateArray;
        const date = new Date(year, month - 1, day, hours, minutes, seconds);

        const formattedHours = date.getHours().toString().padStart(2, '0');
        const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDay = date.getDate().toString().padStart(2, '0');
        const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedYear = date.getFullYear();

        return `${formattedHours}:${formattedMinutes} ${formattedDay}-${formattedMonth}-${formattedYear}`;
    };

    const getNowTimeArray = () => {
        const now = new Date();

        return [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds() * 1000,
        ];
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

            <Box mt={4} textAlign="center">
                <Button
                    variant="contained"
                    color={showLineup ? 'secondary' : 'primary'}
                    onClick={() => setShowLineup(!showLineup)}
                >
                    {showLineup ? 'Hide Lineup' : 'Show Lineup'}
                </Button>
                <Button
                    variant="contained"
                    color={showAdditionalInfo ? 'secondary' : 'primary'}
                    onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                    style={{ marginLeft: '10px' }}
                >
                    {showAdditionalInfo ? 'Hide Additional Info' : 'Show Additional Info'}
                </Button>
            </Box>

            {showLineup && (
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Lineup
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
                                <Typography variant="h5" gutterBottom>
                                    {matchDetails.homeTeam.name}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Formation: {matchDetails.homeTeam.formation}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {matchDetails.homeTeam.lineup.map((player, idx) => (
                                    <Typography key={idx} sx={{ mb: 1 }}>
                                        {player.shirtNumber} - {player.name} ({player.position})
                                    </Typography>
                                ))}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', fontWeight: 'bold'}}>
                                <Typography variant="h5" gutterBottom>
                                    {matchDetails.awayTeam.name}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    Formation: {matchDetails.awayTeam.formation}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {matchDetails.awayTeam.lineup.map((player, idx) => (
                                    <Typography key={idx} sx={{ mb: 1 }}>
                                        {player.shirtNumber} - {player.name} ({player.position})
                                    </Typography>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {showAdditionalInfo && (
                <Box mt={4}>
                    <Accordion>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {/* Attendance */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Attendance:</strong> {matchDetails.attendance || 'N/A'}
                                    </Typography>
                                </Grid>

                                {/* Goals */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Goals:</strong>
                                    </Typography>
                                    <Divider />
                                    {matchDetails.goals.map((goal, index) => (
                                        <Typography key={index} sx={{ mt: 1 }}>
                                            ⚽ {goal.minute}'{goal.injuryTime ? `+${goal.injuryTime}` : ''} -{' '}
                                            {goal.scorer ? goal.scorer.name : 'Unknown'}{' '}
                                            {goal.assist ? `(Assist: ${goal.assist.name})` : ''} - ({goal.team.name}) - {goal.score.home}:{goal.score.away}
                                        </Typography>
                                    ))}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Bookings:</strong>
                                    </Typography>
                                    <Divider />
                                    {matchDetails.bookings && matchDetails.bookings.length > 0 ? (
                                        matchDetails.bookings.map((booking, index) => (
                                            <Typography key={index} sx={{ mt: 1 }}>
                                                {booking.card === "YELLOW" && (
                                                    <>
                                                        🟨 {booking.minute}' - {booking.player.name} ({booking.team.name})
                                                    </>
                                                )}
                                                {booking.card === "RED" && (
                                                    <>
                                                        🟥 {booking.minute}' - {booking.player.name} ({booking.team.name})
                                                    </>
                                                )}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography>No bookings</Typography>
                                    )}
                                </Grid>

                                {/* Substitutions */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Substitutions:</strong>
                                    </Typography>
                                    <Divider />
                                    {matchDetails.substitutions.map((sub, index) => (
                                        <Typography key={index} sx={{ mt: 1 }}>
                                            🔄 {sub.minute}' - {sub.playerOut.name} ⬅️ {sub.playerIn.name} - ({sub.team.name})
                                        </Typography>
                                    ))}
                                </Grid>

                                {/* Referees */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Referees:</strong>
                                    </Typography>
                                    <Divider />
                                    {matchDetails.referees.map((ref, index) => (
                                        <Typography key={index}>
                                            🧑‍⚖️ {ref.name} - {ref.type}{' '}
                                            {ref.nationality ? `(${ref.nationality})` : ''}
                                        </Typography>
                                    ))}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            )}

            {/* Comments Section */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Comments
                </Typography>
                {comments.map((comment, idx) => (
                    <Paper
                        key={idx}
                        elevation={2}
                        sx={{
                            mb: 1,
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            maxWidth: '50%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1,
                            }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                {comment.userName}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ fontStyle: 'italic' }}
                            >
                                {formatDateFromArray(comment.createdAt)}
                            </Typography>
                        </Box>
                        <Typography variant="body2">{comment.content}</Typography>
                    </Paper>
                ))}

                <Box mb={1} sx={{ maxWidth: '50%', marginTop: '15px', marginLeft: '15px' }}>
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
                        Add Comment
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default MatchDetails;