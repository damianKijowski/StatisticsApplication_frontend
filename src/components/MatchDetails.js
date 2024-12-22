import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchDetails = ({ matchId }) => {
    const [matchDetails, setMatchDetails] = useState(null);
    const [prediction, setPrediction] = useState(null);

    // Function to fetch match prediction
    const getMatchPrediction = async (matchId) => {
        try {
            const response = await axios.get(`http://localhost:8080/prediction/match/${matchId}`);
            if (response.data) {
                setPrediction(response.data.prediction);  // Set the prediction (1, 0, or 2)
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
        }
    };

    // Unified function to set or update prediction
    const setMatchPrediction = async (newPrediction, matchId) => {
        const data = {
            prediction: newPrediction,
            matchId: matchId,
        };

        try {
            if (prediction !== null) {
                // If a prediction is already made, use PUT to update it
                const response = await axios.put(`http://localhost:8080/prediction`, data);
                setPrediction(newPrediction); // Update the state with the new prediction
                console.log('Prediction updated:', response.data);
            } else {
                // If no prediction exists, use POST to create a new one
                const response = await axios.post(`http://localhost:8080/prediction`, data);
                setPrediction(newPrediction); // Set the state with the new prediction
                console.log('Prediction created:', response.data);
            }
        } catch (error) {
            console.error('Error setting prediction:', error);
        }
    };

    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/matches/${matchId}`);
                setMatchDetails(response.data);
            } catch (error) {
                console.error('Error fetching match details:', error);
            }
        };

        fetchMatchDetails();  // Fetch match details
        getMatchPrediction(matchId);  // Fetch match prediction on component mount
    }, [matchId]);  // Re-run the effect when matchId changes

    // Disable the button of the current prediction, but allow others to be clicked
    const isPredictionMade = prediction !== null;

    if (!matchDetails) return <p>Loading match details...</p>;

    return (
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
            <h1>Match Details</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <img src={matchDetails.homeTeam.crest} alt={matchDetails.homeTeam.name} style={{ width: '80px' }} />
                    <h2>{matchDetails.homeTeam.name}</h2>
                </div>
                <div>
                    <h3 style={{ textAlign: 'center', padding: '20px' }}>
                        {matchDetails.score.fullTime.home} - {matchDetails.score.fullTime.away}
                    </h3>
                    <p>{new Date(matchDetails.utcDate).toLocaleString()}</p>
                    <p style={{ textAlign: 'center' }}>Status: {matchDetails.status}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <img src={matchDetails.awayTeam.crest} alt={matchDetails.awayTeam.name} style={{ width: '80px' }} />
                    <h2>{matchDetails.awayTeam.name}</h2>
                </div>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center', padding: '0px 0px 20px 0px' }}>
                <h3 style={{ marginRight: '50px' }}>Who will win?</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button
                        style={{
                            padding: '10px 15px',
                            border: prediction === 1 ? '2px solid green' : '1px solid #ccc',
                            backgroundColor: prediction === 1 ? 'green' : 'white',
                            color: prediction === 1 ? 'black' : 'black',  // Text color black when selected
                            cursor: isPredictionMade && prediction === 1 ? 'not-allowed' : 'pointer',
                            marginLeft: '60px',
                            marginRight: '60px',
                            borderRadius: '6px',
                        }}
                        onClick={() => prediction !== 1 && setMatchPrediction(1, matchDetails.id)}  // Allow changing prediction
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = prediction === 1 ? 'green' : 'white'}
                    >
                        {matchDetails.homeTeam.name}
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            border: prediction === 0 ? '2px solid green' : '1px solid #ccc',
                            backgroundColor: prediction === 0 ? 'green' : 'white',
                            color: prediction === 0 ? 'black' : 'black',
                            cursor: isPredictionMade && prediction === 0 ? 'not-allowed' : 'pointer',
                            marginLeft: '60px',
                            marginRight: '60px',
                            borderRadius: '6px',
                        }}
                        onClick={() => prediction !== 0 && setMatchPrediction(0, matchDetails.id)}  // Allow changing prediction
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = prediction === 0 ? 'green' : 'white'}
                    >
                        Draw
                    </button>
                    <button
                        style={{
                            padding: '10px 20px',
                            border: prediction === 2 ? '2px solid green' : '1px solid #ccc',
                            backgroundColor: prediction === 2 ? 'green' : 'white',
                            color: prediction === 2 ? 'black' : 'black',
                            cursor: isPredictionMade && prediction === 2 ? 'not-allowed' : 'pointer',
                            marginLeft: '60px',
                            marginRight: '60px',
                            borderRadius: '6px',
                        }}
                        onClick={() => prediction !== 2 && setMatchPrediction(2, matchDetails.id)}  // Allow changing prediction
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = prediction === 2 ? 'green' : 'white'}
                    >
                        {matchDetails.awayTeam.name}
                    </button>
                </div>
                {prediction !== null && (
                    <p style={{ marginTop: '10px', color: 'green', marginRight: '50px'}}>
                        You predicted: {prediction === 1
                        ? matchDetails.homeTeam.name
                        : prediction === 2
                            ? matchDetails.awayTeam.name
                            : 'Draw'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MatchDetails;
