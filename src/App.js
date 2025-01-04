import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login_registration/Login";
import MainPage from "./components/MainPage";
import MatchDetails from "./components/MatchDetails";
import './App.css';

function App() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    console.log("Logged user: ", loggedInUser);

    return (
        <BrowserRouter>
            <Routes>
                {/* Login Page */}
                <Route
                    path="/"
                    element={<Login onLogin={(user) => setLoggedInUser(user)} />}
                />

                {/* Main Page */}
                <Route
                    path="/MainPage"
                    element={<MainPage loggedInUser={loggedInUser} />}
                />

                {/* Match Details Page */}
                <Route
                    path="/match/:id"
                    element={<MatchDetails loggedInUser={loggedInUser} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
