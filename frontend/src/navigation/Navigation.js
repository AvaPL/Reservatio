import {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";

import './Navigation.scss'
import {NavLink} from "react-router-dom";

export class Navigation extends Component {
    render() {
        return <Navbar variant="light" expand="md" className="navigation-navbar">
            <Navbar.Toggle className="navigation-navbar-toggle" aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="nav-fill w-100">
                    <Nav.Link className="navigation-nav-link" as={NavLink} to="/explore">Explore</Nav.Link>
                    <Nav.Link className="navigation-nav-link" as={NavLink} to="/favorites">Favorites</Nav.Link>
                    <Nav.Link className="navigation-nav-link" as={NavLink} to="/search">Search</Nav.Link>
                    <Nav.Link className="navigation-nav-link" as={NavLink} to="/appointments">Appointments</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }
}