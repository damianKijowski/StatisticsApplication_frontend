import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeagueMatches = ({ leagueCode}) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!leagueCode) return;

        const fetchMatches = async () => {
            setLoading(true);
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            const dateNow = today.toISOString().split('T')[0];
            const dateTomorrow = tomorrow.toISOString().split('T')[0];

            try {
                const response = await axios.get(
                    `http://localhost:8080/matches/${leagueCode}/dateFrom=${dateNow}/dateTo=${dateTomorrow}`
                );
                console.log(response);
                setMatches(response.data.matches); // Assuming API response is an array of matches
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [leagueCode]);

    if (loading) {
        return <p>Loading matches...</p>;
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            <h2>Matches for {matches[0].competition.name}</h2>
            {matches.length === 0 ? (
                <p>No matches found.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {matches.map((match) => (
                        <li
                            key={match.id}
                            style={{
                                padding: '10px',
                                borderBottom: '1px solid #ddd',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {/* Home Team Logo */}
                                <img
                                    src={match.homeTeam.crest}
                                    alt={`${match.homeTeam.name} crest`}
                                    style={{width: '30px', height: '30px', marginRight: '10px'}}
                                />
                                <small>{match.homeTeam.name}</small>
                                <span style={{margin: '0 10px'}}>vs</span>
                                {/* Away Team Logo */}

                                <small>{match.awayTeam.name}</small>
                                <img
                                    src={match.awayTeam.crest}
                                    alt={`${match.awayTeam.name} crest`}
                                    style={{width: '30px', height: '30px', marginLeft: '10px'}}
                                />
                            </div>
                            <div>
                                <div>
                                    Status: <strong>{match.status}</strong>
                                </div>
                                <small>{formatDateTime(match.utcDate)}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default LeagueMatches;
