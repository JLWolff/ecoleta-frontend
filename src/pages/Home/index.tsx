import React from 'react';
import './styles.css';
import { FiLogIn, FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.svg';

const Home = () => {
    return(
        <div id="page-home">
            <div className="header">
                <header>
                    <img src={logo} alt="EcoletaIMG"/>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>
                            Cadastre um ponto de coleta
                        </strong>
                    </Link>  
                </header>
            </div>    
            <div className="content">
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                    <Link to="/points">
                        <span>
                            <FiSearch />
                        </span>
                        <strong>
                            Procurar pontos de coleta
                        </strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;