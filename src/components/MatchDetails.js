import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MatchDetails = () => {
    const { id } = useParams(); // Get match ID from the URL
    const [match, setMatch] = useState(null);

    useEffect(() => {
        // Fetch data for the specific match
        axios.get(`http://localhost:8080/matches/${id}`) // Replace with your backend endpoint
            .then((response) => {
                setMatch(response.data); // Set match data
            })
            .catch((error) => {
                console.error('Error fetching match details:', error);
            });
    }, [id]);

    if (!match) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#0a1a2a',
                    color: '#fff',
                }}
            >
                <p>Loading match details...</p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#0a1a2a',
                color: '#fff',
                textAlign: 'center',
            }}
        >
            <h1>Match Details</h1>
            <h2>
                {match.homeTeam.name} vs {match.awayTeam.name}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                <img
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.name}
                    style={{ width: '80px', marginRight: '20px' }}
                />
                <img
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.name}
                    style={{ width: '80px' }}
                />
            </div>
            <p>Status: {match.status}</p>
            <p>Date: {new Date(match.utcDate).toLocaleString()}</p>
            <p>Score: {match.score.fullTime.home} - {match.score.fullTime.away}</p>
        </div>
    );
};

export default MatchDetails;
