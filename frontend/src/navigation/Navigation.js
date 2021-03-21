import {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";

import './Navigation.scss'
import {NavLink} from "react-router-dom";

export class Navigation extends Component {
    render() {
        return <Navbar collapseOnSelect variant="light" expand="md" className="navigation-navbar">
            <Navbar.Toggle className="navigation-navbar-toggle" aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="nav-fill w-100">
                    {this.props.routes.map(r => this.navLink(r.name, r.path))}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }

    navLink(name, to) {
        return <Nav.Link as={NavLink} className="navigation-nav-link" to={to} key={name}
                         eventKey={name}>{name}</Nav.Link>;
    }
}