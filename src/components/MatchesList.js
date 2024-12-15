import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchesList = ({league, onSelectMatch}) => {
    const [matches, setMatches] = useState([]);
    const [groupedMatches, setGroupedMatches] = useState({});

    const saturday = new Date(2024, 11, 15); // Month is 0-indexed, so 11 = December
    const date = saturday.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    const sunday = new Date(2024, 11, 16);
    const date2 = sunday.toISOString().split('T')[0];

    useEffect(() => {
        const fetchLeagues = async () => {
            console.log("date: " + date);
            const response = await axios.get(`http://localhost:8080/matches/dateFrom=${date}/dateTo=${date2}`) // Replace with your API endpoint

            const fetchedMatches = response.data.matches;
            setMatches(fetchedMatches);
            console.log(response);
            // Group matches by competition.code
            const grouped = fetchedMatches.reduce((acc, match) => {
                const code = match.competition.code;
                if (!acc[code]) {
                    acc[code] = [];
                }
                acc[code].push(match);
                return acc;
            }, {});
            setGroupedMatches(grouped);
        }
            fetchLeagues();
    }, [date,date2]);


    return (
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
            <h1>Matches</h1>
            {matches.length === 0 ? (
                <p>Loading matches...</p>
            ) : (
                Object.keys(groupedMatches).map((code) => (
                    <div key={code} style={{ marginBottom: '30px', padding: '15px', borderRadius: '8px' }}>
                        <h2 style={{ marginBottom: '10px' }}>{code}</h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {groupedMatches[code].map((match) => (
                                <li
                                    key={match.id}
                                    onClick={() => onSelectMatch(match.id)}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px',
                                        borderBottom: '1px solid #334455',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={match.homeTeam.crest}
                                            alt={`${match.homeTeam.name} crest`}
                                            style={{ width: '30px', marginRight: '10px' }}
                                        />
                                        <span style={{ marginRight: '10px' }}>{match.homeTeam.name}</span>
                                        <span style={{ margin: '0 10px' }}>vs</span>
                                        <span style={{ marginRight: '10px' }}>{match.awayTeam.name}</span>
                                        <img
                                            src={match.awayTeam.crest}
                                            alt={`${match.awayTeam.name} crest`}
                                            style={{ width: '30px', marginLeft: '10px' }}
                                        />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '14px', marginRight: '10px' }}>
                                            {match.score.fullTime.home} - {match.score.fullTime.away}
                                        </span>
                                        <small style={{ display: 'block', fontSize: '12px' }}>
                                            {new Date(match.utcDate).toLocaleString()}
                                        </small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};


export default MatchesList;
