import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MatchDetails from './MatchDetails'; // Import Twojego komponentu
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ikony powrotu

const MatchesList = () => {
    const [matches, setMatches] = useState([]);
    const [groupedMatches, setGroupedMatches] = useState({});
    const [selectedMatchId, setSelectedMatchId] = useState(null); // Stan dla wybranego meczu

    const saturday = new Date(2024, 11, 16);
    const date = saturday.toISOString().split('T')[0];
    const sunday = new Date(2024, 11, 17);
    const date2 = sunday.toISOString().split('T')[0];

    useEffect(() => {
        const fetchLeagues = async () => {
            const response = await axios.get(`http://localhost:8080/matches/dateFrom=${date}/dateTo=${date2}`);
            const fetchedMatches = response.data.matches;

            setMatches(fetchedMatches);

            const grouped = fetchedMatches.reduce((acc, match) => {
                const code = match.competition.code;
                if (!acc[code]) acc[code] = [];
                acc[code].push(match);
                return acc;
            }, {});
            setGroupedMatches(grouped);
        };
        fetchLeagues();
    }, [date, date2]);

    return (
        <div style={{ padding: '20px', backgroundColor: 'white' }}>
            <h1>Matches</h1>

            {selectedMatchId ? (
                // Wyświetlanie szczegółów wybranego meczu
                <div>
                    {/* Ikona powrotu */}
                    <IconButton
                        onClick={() => setSelectedMatchId(null)}
                        style={{ marginBottom: '20px' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    {/* Wywołanie Twojego komponentu MatchDetails */}
                    <MatchDetails matchId={selectedMatchId} />
                </div>
            ) : (
                // Wyświetlanie listy wszystkich meczów
                matches.length === 0 ? (
                    <p>Loading matches...</p>
                ) : (
                    Object.keys(groupedMatches).map((code) => (
                        <div key={code} style={{ marginBottom: '30px', padding: '15px', borderRadius: '8px' }}>
                            <h2 style={{ marginBottom: '10px' }}>{code}</h2>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {groupedMatches[code].map((match) => (
                                    <li
                                        key={match.id}
                                        onClick={() => setSelectedMatchId(match.id)} // Ustaw ID wybranego meczu
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
                )
            )}
        </div>
    );
};

export default MatchesList;