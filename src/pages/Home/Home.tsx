import React from "react";
import { FiLogIn } from "react-icons/fi";

import logo from "../../assets/logo.svg";
import "./styles.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Logo ecoleta" />
        </header>
        <main>
          <h1>Seu market place de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos d ecoleta de forma eficiente
          </p>
          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadestre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};
