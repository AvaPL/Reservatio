import React, {Component} from 'react';
import {Button, Col, Nav, Row, Tab} from "react-bootstrap";

import './Employees.scss'

class Employees extends Component {
    render() {
        return (
            <div className="employees-text m-4 m-lg-5">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col className="align-self-center">
                            <h1 className="float-left employees-text font-weight-bold">Employee</h1>
                        </Col>
                        <Col className="align-self-center">
                            <div className="float-right">
                                <Button className="employees-button-delete shadow-none">Delete</Button>
                                <Button className="employees-button-add shadow-none">Add new</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="employees-border py-3">
                        <Col className="font-weight-bold" sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first" className="employees-tab">Tab 1</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second" className="employees-tab">Tab 2</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <span className="font-weight-bold" style={{fontSize: "150%"}}>Services:</span>
                                    <ul>
                                        <li>1</li>
                                        <li>2</li>
                                        <li>3</li>
                                    </ul>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    Test
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}

export default Employees;