import React, {Component} from 'react';
import {Alert, Button, Col, Modal, Nav, Row, Tab} from "react-bootstrap";
import AddServiceModal from "./AddServiceModal";
import styles from "./Services.module.scss";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Services extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            services: [],
            isLoaded: false,
            error: null,
            errorAdding: null,
            errorDeleting: null,
            showModalAdd: false,
            showModalDelete: false,
        };
    }

    componentDidMount() {
        this.fetchServices().then(this.processServices(), this.handleError());
    }

    fetchServices() {
        const serviceProviderId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/serviceProviderServicesViews/${serviceProviderId}/services`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(response => response._embedded.serviceViews);
    }

    processServices() {
        return services => {
            this.setState({
                isLoaded: true,
                services: services,
                selectedService: services[0]
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
                                                <li key={employee.id}>{employee.name}</li>
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
        const serviceProviderId = authService.token?.entityId;
        authService.fetchAuthenticated(`${backendHost}/rest/addService/${serviceProviderId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service)
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to post");
            }
            return response;
        })
            .then(() => console.log("Service added successfully"))
            .then(() => this.fetchServices().then(services => {
                this.setState({
                    showModalAdd: false,
                    errorAdding: null,
                    services: services,
                    selectedService: services[services.length - 1]
                })
            }, this.handleError()))
            .catch(error => {
                console.log("Error occurred: ", error);
                this.setState({showModalAdd: false, errorAdding: error});
            });
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