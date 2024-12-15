import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchDetails = ({ matchId }) => {
    const [matchDetails, setMatchDetails] = useState(null);

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
                    <p style={{textAlign: 'center'}}>Status: {matchDetails.status}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <img src={matchDetails.awayTeam.crest} alt={matchDetails.awayTeam.name} style={{ width: '80px' }} />
                    <h2>{matchDetails.awayTeam.name}</h2>
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;
