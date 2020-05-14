import React from 'react';

import './Header.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.menuOpen = false;
    }

    expandMenu = () => {

        if (this.menuOpen) {
            document.getElementById("header").style.height = "100px";
            document.getElementById("header-menu-icon").style.transform = "rotate(0deg)";
        } else {
            document.getElementById("header").style.height = "100vh";
            document.getElementById("header-menu-icon").style.transform = "rotate(90deg)";
        }

        this.menuOpen = !this.menuOpen;

    }

    render() {
        return (
            <div id="header">
                <Row id="header-always-visible">
                    <div id="header-logo">
                        <h1>StaySane</h1>
                    </div>
                    <div id="header-menu-icon" onClick={this.expandMenu}>
                    <svg class="bi bi-list" width="40px" height="40px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>
                    </svg>
                    </div>
                </Row>
                <Row id="header-menu-hidden">
                    <ul>
                        <li>About me</li>
                        <li>Example menu</li>
                        <li>Lorem ipsum</li>
                    </ul>
                </Row>
            </div>
        );
    }
}

export default Header;