import Login from "./components/login_registration/Login";
import './App.css';
import MainPage from "./components/MainPage";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MatchDetails from './components/MatchDetails';

function App() {
  return (


  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route path="/MainPage" element={<MainPage/>} />
      <Route path="/match/:id" element={<MatchDetails />} />
    </Routes>
  </BrowserRouter>

  );
}

export default App;
