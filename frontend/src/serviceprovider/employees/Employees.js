import React, {Component} from 'react';
import {Alert, Button, Col, Modal, Nav, Row, Tab} from "react-bootstrap";
import styles from './Employees.module.scss';
import {AddEmployeeModal} from "./AddEmployeeModal";
import EditEmployeeModal from "./EditEmployeeModal";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Employees extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            employees: [],
            isLoaded: false,
            error: null,
            errorAdding: null,
            errorDeleting: null,
            showModalAdd: false,
            showModalEdit: false,
            showModalDelete: false,
        };
    }

    componentDidMount() {
        this.fetchEmployees().then(this.processEmployees(), this.handleError());
    }

    fetchEmployees() {
        const serviceProviderId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/serviceProviderEmployeesViews/${serviceProviderId}/employees`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(response => response._embedded.employeeViews);
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
            console.log("Error occurred: ", error);
        }
    }

    render() {
        return (
            <div>
                <div className={`m-4 m-lg-5 ${styles.text}`}>
                    <Tab.Container defaultActiveKey={0}>
                        <Row>
                            <Col className="align-self-center">
                                <h1 className={`float-left font-weight-bold ${styles.text}`}>Employee</h1>
                            </Col>
                            <Col className="align-self-center">
                                <div className="float-right">
                                    <Button className={`${styles.buttonSecondary} shadow-none`}
                                            onClick={() => this.setState({showModalDelete: true})}>Delete</Button>
                                    <Button className={`${styles.buttonSecondary} shadow-none`}
                                            onClick={() => this.setState({showModalEdit: true})}>Edit</Button>
                                    <Button className={`${styles.buttonPrimary} shadow-none`}
                                            onClick={() => this.setState({showModalAdd: true})}>Add new</Button>
                                </div>
                            </Col>
                        </Row>
                        {this.alerts()}
                        <Row className={`${styles.border} py-3`}>
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
                {this.editEmployeeModal()}
                {this.deleteEmployeeModal()}
            </div>
        );
    }

    alerts() {
        if (this.state.errorAdding) {
            return <Alert variant="danger" onClose={() => this.setState({errorAdding: null})} dismissible>
                Failed to add employee
            </Alert>
        } else if (this.state.errorDeleting) {
            return <Alert variant="danger" onClose={() => this.setState({errorDeleting: null})} dismissible>
                {this.state.errorDeleting}
            </Alert>
        }
    }

    employeesNamesPanel() {
        if (this.state.error) {
            return <span>Unable to load employees</span>
        } else if (!this.state.isLoaded) {
            return <span>Loading...</span>
        } else {
            return (
                <Nav variant="pills" className="flex-column">
                    {
                        this.state.employees.map(employee =>
                            <Nav.Item key={employee.id}>
                                <Nav.Link eventKey={employee.id} className={styles.employeesTab}
                                          active={this.state.selectedEmployee?.id === employee.id}
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
                        this.state.employees.map(employee =>
                            <Tab.Pane key={employee.id} eventKey={employee.id}
                                      active={this.state.selectedEmployee?.id === employee.id}>
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
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to post");
            }
            return response;
        })
            .then(() => console.log("Employee added successfully"))
            .then(() => this.fetchEmployees().then(employees => {
                this.setState({
                    showModalAdd: false,
                    errorAdding: null,
                    employees: employees,
                    selectedEmployee: employees[employees.length - 1]
                })
            }, this.handleError()))
            .catch(error => {
                console.log("Error occurred: ", error);
                this.setState({showModalAdd: false, errorAdding: error});
            });
    };

    editEmployeeModal() {
        return (
            <EditEmployeeModal show={this.state.showModalEdit}
                               employeeToEdit={this.state.selectedEmployee}
                               onHide={() => this.setState({showModalEdit: false})}
                               onClick={this.onEditClick}/>
        );
    }

    onEditClick = employee => {
        console.log("Employee to edit: ");
        console.log(employee);
        authService.fetchAuthenticated(`${backendHost}/rest/editEmployee/${this.state.selectedEmployee.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee)
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to edit");
            }
            return response;
        })
            .then(() => console.log("Employee edited successfully"))
            .then(() => this.fetchEmployees().then(employees => {
                console.log(employees)
                this.setState({
                    showModalEdit: false,
                    errorEditing: null,
                    employees: employees,
                    selectedEmployee: employees.find(e => e.id === employee.id)
                })
            }, this.handleError()))
            .catch(error => {
                console.log("Error occurred: ", error);
                this.setState({showModalEdit: false, errorEditing: error});
            });
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
                    {this.getDeleteModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${styles.buttonSecondary} shadow-none`}
                            onClick={() => this.setState({showModalDelete: false})}>Cancel</Button>
                    <Button className={`${styles.buttonPrimary} shadow-none`} disabled={!this.state.selectedEmployee}
                            onClick={this.onDeleteClicked}>Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    getDeleteModalBody() {
        if (this.state.selectedEmployee) {
            return <>
                Are you sure you want to
                delete {this.state.selectedEmployee?.firstName} {this.state.selectedEmployee?.lastName}?
            </>;
        } else {
            return <>
                No employee selected.
            </>;
        }
    }

    onDeleteClicked = () => {
        authService.fetchAuthenticated(`${backendHost}/rest/deleteEmployee/${this.state.selectedEmployee.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (!response.ok) {
                throw response
            }
            return response;
        })
            .then(() => console.log(`Deleted employee [${this.state.selectedEmployee.firstName}] [${this.state.selectedEmployee.lastName}]`))
            .then(() => this.fetchEmployees().then(employees => {
                this.setState({
                    showModalDelete: false,
                    errorDeleting: null,
                    employees: employees,
                    selectedEmployee: employees[employees.length - 1]
                })
            }, this.handleError()))
            .catch(error => {
                if (error.text) {
                    error.text().then(error => {
                        console.log("Error occurred: ", error);
                        this.setState({showModalDelete: false, errorDeleting: error});
                    });
                } else {
                    console.log("Error occurred: Failed to delete employee");
                    this.setState({showModalDelete: false, errorDeleting: "Failed to delete employee"});
                }
            });
    };
}

export default Employees;