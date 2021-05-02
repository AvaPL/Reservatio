import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";
import styles from './Employees.module.scss';

export class AddEmployeeModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            services: [],
            checkedServices: new Set(),
            error: null,
            isLoaded: false
        }
    }

    componentDidMount() {
        this.fetchServices().then(this.processEmployees(), this.handleError());
    }

    fetchServices() {
        const serviceProviderId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/serviceProviderEmployeesViews/${serviceProviderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(response => response.services);
    }

    processEmployees() {
        return services => {
            this.setState({
                isLoaded: true,
                services: services
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
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className={styles.formTitle}>
                        Add new employee
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="firstName">
                            <Form.Label className={styles.formLabel}>First name</Form.Label>
                            <Form.Control type="text" placeholder="First name"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label className={styles.formLabel}>Last name</Form.Label>
                            <Form.Control type="text" placeholder="Last name"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="services">
                            <Form.Label className={styles.formLabel}>Services</Form.Label>
                            {
                                this.renderServices()
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${styles.buttonSecondary} shadow-none`}
                            onClick={this.props.onHide}>Cancel</Button>
                    <Button className={`${styles.buttonPrimary} shadow-none`}
                            onClick={this.handleAddClicked}>Add</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    handleAddClicked = () => {
        let employeeToAdd = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            services: Array.from(this.state.checkedServices)
        }
        this.props.onClick(employeeToAdd);
        this.setState({checkedServices: new Set()})
    };

    renderServices() {
        if (this.state.error) {
            return <Form.Control plaintext readOnly defaultValue="Error"/>
        } else if (!this.state.isLoaded) {
            return <Form.Control plaintext readOnly defaultValue="Loading..."/>
        } else {
            return this.state.services.map(service =>
                <Form.Check id={service.name} key={service.name} className={styles.formCheckbox}
                            type="checkbox" label={service.name}
                            onChange={event => this.handleServiceChange(event)}/>
            );
        }
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value})
    }

    handleServiceChange(event) {
        const checkedServices = this.state.checkedServices
        const eventId = event.target.id
        if (event.target.checked) checkedServices.add(eventId)
        else checkedServices.delete(eventId)
        this.setState({checkedServices: checkedServices});
    };
}