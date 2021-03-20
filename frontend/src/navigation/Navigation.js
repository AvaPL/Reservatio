import {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";

import './Navigation.scss'

export class Navigation extends Component {
    render() {
        return <Navbar variant="light" expand="md" className="navigation-navbar">
            <Navbar.Toggle className="navigation-navbar-toggle" aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="nav-fill w-100">
                    <Nav.Link className="navigation-nav-link" href="#explore">Explore</Nav.Link>
                    <Nav.Link className="navigation-nav-link" href="#favorites">Favorites</Nav.Link>
                    <Nav.Link className="navigation-nav-link" href="#search">Search</Nav.Link>
                    <Nav.Link className="navigation-nav-link" href="#appointments">Appointments</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }
}