import React, {Component} from 'react';
import {Button, Col, Modal, Nav, Row, Tab} from "react-bootstrap";

import './Employees.scss'
import {AddEmployeeModal} from "./AddEmployeeModal";

class Employees extends Component {

    constructor(props, context) {
        super(props, context);
        let state = {
            employees: [
                {
                    name: "John Doe",
                    services: ["Service A", "Service B", "Service C"]
                },
                {
                    name: "Another John",
                    services: ["Service B", "Service C"]
                }
            ],
            showModalAdd: false,
            showModalDelete: false,
        }
        state.selectedEmployee = state.employees[0]
        this.state = state
    }

    render() {
        return (
            <div>
                <div className="employees-text m-4 m-lg-5">
                    <Tab.Container defaultActiveKey={this.state.selectedEmployee.name}>
                        <Row>
                            <Col className="align-self-center">
                                <h1 className="float-left employees-text font-weight-bold">Employee</h1>
                            </Col>
                            <Col className="align-self-center">
                                <div className="float-right">
                                    <Button className="employees-button-secondary shadow-none"
                                            onClick={() => this.setState({showModalDelete: true})}>Delete</Button>
                                    <Button className="employees-button-primary shadow-none"
                                            onClick={() => this.setState({showModalAdd: true})}>Add new</Button>
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
                {this.addEmployeeModal()}
                {this.deleteEmployeeModal()}
            </div>
        );
    }

    employeesNamesPanel() {
        return (
            <Nav variant="pills" className="flex-column">
                {
                    this.state.employees.map(employee =>
                        <Nav.Item>
                            <Nav.Link eventKey={employee.name} className="employees-tab"
                                      onSelect={() => this.setState({selectedEmployee: employee})}>{employee.name}</Nav.Link>
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

    addEmployeeModal() {
        return (
            <AddEmployeeModal show={this.state.showModalAdd}
                              onHide={() => this.setState({showModalAdd: false})}
                              onClick={() => console.log("Added employee")}/>
        );
    }

    deleteEmployeeModal() {
        return (
            <Modal
                show={this.state.showModalDelete}
                onHide={() => this.setState({showModalDelete: false})}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete employee
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {this.state.selectedEmployee.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button className="employees-button-secondary shadow-none"
                            onClick={() => this.setState({showModalDelete: false})}>Cancel</Button>
                    <Button className="employees-button-primary shadow-none"
                            onClick={() => console.log(`Deleted employee [${this.state.selectedEmployee.name}]`)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Employees;