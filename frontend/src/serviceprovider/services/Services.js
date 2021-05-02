import React, {Component} from 'react';
import {Alert, Button, Col, Modal, Nav, Row, Tab} from "react-bootstrap";
import AddServiceModal from "./AddServiceModal";
import styles from "./Services.module.scss";

class Services extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            services: [
                {
                    id: 1,
                    name: "Haircut",
                    description: "Your hair will look divine.",
                    price: 100,
                    duration: 60,
                    employees: ["Employee A"]
                },
                {
                    id: 2,
                    name: "Manicure",
                    description: "Your nails will look divine.",
                    price: 50,
                    duration: 90,
                    employees: ["Employee A", "Employee B"]
                },
                {
                    id: 3,
                    name: "Something",
                    description: "Your something will look divine.",
                    price: 200,
                    duration: 120,
                    employees: ["Employee A", "Employee B", "Employee C"]
                }
            ],
            isLoaded: true, // TODO: should be false at first
            error: null,
            errorAdding: null,
            errorDeleting: null,
            showModalAdd: false,
            showModalDelete: false,
        };
        this.state.selectedService = this.state.services[0]
    }


    render() {
        return (
            <div>
                <div className={`m-4 m-lg-5 ${styles.text}`}>
                    <Tab.Container defaultActiveKey={0}>
                        <Row>
                            <Col className="align-self-center">
                                <h1 className={`float-left font-weight-bold ${styles.text}`}>Service</h1>
                            </Col>
                            <Col className="align-self-center">
                                <div className="float-right">
                                    <Button className={`${styles.buttonSecondary} shadow-none`}
                                            onClick={() => this.setState({showModalDelete: true})}>Delete</Button>
                                    <Button className={`${styles.buttonPrimary} shadow-none`}
                                            onClick={() => this.setState({showModalAdd: true})}>Add new</Button>
                                </div>
                            </Col>
                        </Row>
                        {this.alerts()}
                        <Row className={`${styles.border} py-3`}>
                            <Col className="font-weight-bold" sm={3}>
                                {this.servicesNamesPanel()}
                            </Col>
                            <Col sm={9}>
                                {this.serviceEmployeesPanel()}
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
                {this.addServiceModal()}
                {this.deleteServiceModal()}
            </div>
        );
    }

    alerts() {
        if (this.state.errorAdding) {
            return <Alert variant="danger" onClose={() => this.setState({errorAdding: null})} dismissible>
                Failed to add service
            </Alert>
        } else if (this.state.errorDeleting) {
            return <Alert variant="danger" onClose={() => this.setState({errorDeleting: null})} dismissible>
                {this.state.errorDeleting}
            </Alert>
        }
    }

    servicesNamesPanel() {
        if (this.state.error) {
            return <span>Unable to load services</span>
        } else if (!this.state.isLoaded) {
            return <span>Loading...</span>
        } else {
            return (
                <Nav variant="pills" className="flex-column">
                    {
                        this.state.services.map(service =>
                            <Nav.Item key={service.id}>
                                <Nav.Link eventKey={service.id} className={styles.servicesTab}
                                          active={this.state.selectedService?.id === service.id}
                                          onSelect={() => this.setState({selectedService: service})}>{service.name}</Nav.Link>
                            </Nav.Item>
                        )
                    }
                </Nav>
            );
        }
    }

    serviceEmployeesPanel() {
        if (!this.state.error && this.state.isLoaded) {
            return (
                <Tab.Content>
                    {
                        this.state.services.map(service =>
                            <Tab.Pane key={service.id} eventKey={service.id}
                                      active={this.state.selectedService?.id === service.id}>
                                <span className="font-weight-bold" style={{fontSize: "150%"}}>About:</span>
                                <div>Description: {service.description}</div>
                                <div>Price: {service.price}$</div>
                                <div>Duration: {service.duration} minutes</div>
                                <span className="font-weight-bold" style={{fontSize: "150%"}}>Employees:</span>
                                {
                                    <ul>
                                        {
                                            service.employees.map(employee =>
                                                <li key={employee}>{employee}</li>
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

    addServiceModal() {
        return (
            <AddServiceModal show={this.state.showModalAdd}
                              onHide={() => this.setState({showModalAdd: false})}
                              onClick={this.onAddClick}/>
        );
    }

    onAddClick = service => {
        console.log("Service to add: ");
        console.log(service);
        this.setState({showModalAdd: false});
    };

    deleteServiceModal() {
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
                        Delete service
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.getDeleteModalBody()}
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${styles.buttonSecondary} shadow-none`}
                            onClick={() => this.setState({showModalDelete: false})}>Cancel</Button>
                    <Button className={`${styles.buttonPrimary} shadow-none`} disabled={!this.state.selectedService}
                            onClick={this.onDeleteClicked}>Delete</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    getDeleteModalBody() {
        if (this.state.selectedService) {
            return <>
                Are you sure you want to
                delete {this.state.selectedService?.name}?
            </>;
        } else {
            return <>
                No service selected.
            </>;
        }
    }

    onDeleteClicked = () => {
        console.log("Employee to delete: ")
        console.log(this.state.selectedService)
    };
}

export default Services;