import React, {Component} from 'react';
import {Button, Col, Nav, Row, Tab} from "react-bootstrap";

import './Employees.scss'

class Employees extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            employees: [
                {
                    name: "John Doe",
                    services: ["Service A", "Service B", "Service C"]
                },
                {
                    name: "Another John",
                    services: ["Service B", "Service C"]
                }
            ]
        }
    }

    render() {
        return (
            <div className="employees-text m-4 m-lg-5">
                <Tab.Container defaultActiveKey={this.state.employees[0].name}>
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
                            {this.employeesNamesPanel()}
                        </Col>
                        <Col sm={9}>
                            {this.employeeServicesPanel()}
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }

    employeesNamesPanel() {
        return (
            <Nav variant="pills" className="flex-column">
                {
                    this.state.employees.map(employee =>
                        <Nav.Item>
                            <Nav.Link eventKey={employee.name} className="employees-tab">{employee.name}</Nav.Link>
                        </Nav.Item>
                    )
                }
            </Nav>
        );
    }

    employeeServicesPanel() {
        return (
            <Tab.Content>
                {
                    this.state.employees.map(employee =>
                        <Tab.Pane eventKey={employee.name}>
                            <span className="font-weight-bold" style={{fontSize: "150%"}}>Services:</span>
                            {
                                <ul>
                                    {
                                        employee.services.map(service =>
                                            <li>{service}</li>
                                        )
                                    }
                                </ul>
                            }
                        </Tab.Pane>
                    )
                }
            </Tab.Content>
        );
    }
}

export default Employees;