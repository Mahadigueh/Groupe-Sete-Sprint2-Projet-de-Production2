import React from "react"; 
import "./App.css";
import { Link } from 'react-router-dom'
import { Route, Routes } from 'react-router';
import AddBoycott from "./components/AddBoycott";
import Allboycotts from "./components/Allboycotts";
import Login from "./components/Login";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateBoycott from "./components/UpdateBoycott";

function App() {
  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>{!data ? "Loading..." : data}</p>
  //     </header>
  //   </div>
  // );
  return (
    <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/Adn/Accueil" className="navbar-brand">
            ADN
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/boycotts"} className="nav-link">
                Tous les boycotts
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/addBoycott"} className="nav-link">
                Add Boycott
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Allboycotts/>} />
            <Route path="/boycotts" element={<Allboycotts/>} />
            <Route path="/addBoycott" element={<AddBoycott/>} />
            <Route path="/UpdateBoycott/:id" element={<UpdateBoycott/>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
