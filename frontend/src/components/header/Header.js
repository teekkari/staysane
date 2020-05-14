import React from 'react';

import './Header.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.menuOpen = false;
    }

    toggleHeaderMenu = () => {

        if (this.menuOpen) {
            document.getElementById("header").style.height = "100px";
            document.getElementById("header-menu-icon").style.transform = "rotate(0deg)";
        } else {
            document.getElementById("header").style.height = "100vh";
            document.getElementById("header-menu-icon").style.transform = "rotate(90deg)";
        }

        this.menuOpen = !this.menuOpen;

    }

    selectMenuItem = (event) => {
        this.toggleHeaderMenu();
        this.props.setView(event.target.getAttribute("data-key"));
    }

    render() {
        return (
            <div id="header">
                <Row id="header-always-visible">
                    <div id="header-logo">
                        <h1>StaySane</h1>
                    </div>
                    <div id="header-menu-icon" onClick={this.toggleHeaderMenu}>
                    <svg className="bi bi-list" width="40px" height="40px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z" clipRule="evenodd"/>
                    </svg>
                    </div>
                </Row>
                <Row id="header-menu-hidden">
                    <ListGroup id="header-menu-listgroup" variant="flush">
                        <ListGroup.Item data-key="modules" onClick={this.selectMenuItem} className="header-menu-item">Modules</ListGroup.Item>
                        <ListGroup.Item data-key="stats" onClick={this.selectMenuItem} className="header-menu-item">Stats</ListGroup.Item>
                        <ListGroup.Item data-key="undefined" onClick={this.selectMenuItem} className="header-menu-item">Reserved</ListGroup.Item>
                        <ListGroup.Item data-key="undefined" onClick={this.selectMenuItem} className="header-menu-item">Reserved</ListGroup.Item>
                    </ListGroup>
                </Row>
            </div>
        );
    }
}

export default Header;