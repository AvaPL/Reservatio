import React, {Component} from 'react';
import {Button, Col, Modal, Nav, Row, Tab} from "react-bootstrap";

import './Employees.scss'
import {AddEmployeeModal} from "./AddEmployeeModal";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Employees extends Component {

    constructor(props, context) {
        super(props, context);
        // TODO: Should be simplified
        let state = {
            employees: [
                {
                    firstName: "John",
                    lastName: "Doe",
                    services: ["Service A", "Service B", "Service C"]
                }
            ],
            error: null,
            isLoaded: false,
            linkHasBeenClicked: false,
            showModalAdd: false,
            showModalDelete: false,
        }
        this.state = state;
        state.selectedEmployee = state.employees[0];
    }

    componentDidMount() {
        // TODO: Predefined employees can't be deleted for some reason
        this.fetchEmployees().then(this.processEmployees(), this.handleError());
    }

    fetchEmployees() {
        const serviceProviderId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/serviceProviderEmployeesViews/${serviceProviderId}/employees`)
            // TODO: Check response status here
            .then(res => res.json()).then(res => res._embedded.employeeViews);
    }

    processEmployees() {
        return employees => {
            this.setState({
                isLoaded: true,
                employees: employees,
                selectedEmployee: employees[0]
            });
        };
    }

    handleError() {
        return error => {
            this.setState({
                isLoaded: true,
                error: error
            })
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <div className="employees-text m-4 m-lg-5">
                    <Tab.Container defaultActiveKey={0}>
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
        if (this.state.error) {
            return <span>Error</span>
        } else if (!this.state.isLoaded) {
            return <span>Loading...</span>
        } else {
            return (
                <Nav variant="pills" className="flex-column">
                    {
                        this.state.employees.map((employee, i) =>
                            <Nav.Item key={i}>
                                <Nav.Link eventKey={i} className="employees-tab"
                                          onSelect={() => this.setState({selectedEmployee: employee})}>{employee.firstName} {employee.lastName}</Nav.Link>
                            </Nav.Item>
                        )
                    }
                </Nav>
            );
        }
    }

    employeeServicesPanel() {
        if (!this.state.error && this.state.isLoaded) {
            return (
                <Tab.Content>
                    {
                        this.state.employees.map((employee, i) =>
                            <Tab.Pane key={i} eventKey={i}>
                                <span className="font-weight-bold" style={{fontSize: "150%"}}>Services:</span>
                                {
                                    <ul>
                                        {
                                            employee.services.map(service =>
                                                <li key={service.name}>{service.name}</li>
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

    addEmployeeModal() {
        return (
            <AddEmployeeModal show={this.state.showModalAdd}
                              onHide={() => this.setState({showModalAdd: false})}
                              onClick={this.onAddClick}/>
        );
    }

    onAddClick = employee => {
        console.log("Employee to add: ")
        console.log(employee)
        const serviceProviderId = authService.token?.entityId;
        authService.fetchAuthenticated(`${backendHost}/rest/addEmployee/${serviceProviderId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee)
        }).then(() => console.log("Employee added successfully"))
            // TODO: Check response status here
            .catch(error => console.log(error));
        this.setState({showModalAdd: false});
        // TODO: Use state instead of reloading the window
        window.location.reload(false);
    };

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
                    Are you sure you want to
                    delete {this.state.selectedEmployee.firstName} {this.state.selectedEmployee.lastName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button className="employees-button-secondary shadow-none"
                            onClick={() => this.setState({showModalDelete: false})}>Cancel</Button>
                    <Button className="employees-button-primary shadow-none"
                            onClick={this.onDeleteClicked}>Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    onDeleteClicked = () => {
        const serviceProviderId = authService.token?.entityId;
        authService.fetchAuthenticated(`${backendHost}/rest/deleteEmployee/${serviceProviderId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: this.state.selectedEmployee.firstName,
                lastName: this.state.selectedEmployee.lastName
            })
        }).then(() => console.log(`Deleted employee [${this.state.selectedEmployee.firstName}] [${this.state.selectedEmployee.lastName}]`))
            // TODO: Check response status here
            .catch(error => console.log(error));
        this.setState({showModalDelete: false});
        // TODO: Use state instead of reloading the window
        window.location.reload(false);
    };
}

export default Employees;