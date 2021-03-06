import React, {Component} from 'react';
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";
import {Button, Modal} from "react-bootstrap";
import styles from "./Employees.module.scss";
import Form from "react-bootstrap/Form";

class EditEmployeeModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            services: [],
            checkedServices: new Set(),
            error: null,
            isLoaded: false,
            validated: false
        }
    }

    componentDidMount() {
        this.fetchServices().then(this.processServices(), this.handleError());
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

    processServices() {
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
                onShow={this.handleShow}
                onHide={this.handleHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className={styles.formTitle}>
                        Edit employee
                    </Modal.Title>
                </Modal.Header>
                <Form noValidate validated={this.state.validated} onSubmit={this.onSubmit}>
                    <Modal.Body>
                        {this.getModalBody()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className={`${styles.buttonSecondary} shadow-none`}
                                onClick={this.handleHide}>Cancel</Button>
                        <Button className={`${styles.buttonPrimary} shadow-none`} type="submit"
                                disabled={!this.props.employeeToEdit}
                                onClick={() => this.setState({validated: true})}>Edit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }

    handleShow = () => {
        const checkedServices = this.state.checkedServices
        this.props.employeeToEdit?.services.forEach(service => checkedServices.add(service.name))
        this.setState({checkedServices: checkedServices});
    };

    handleHide = () => {
        this.setState({checkedServices: new Set()})
        this.props.onHide();
    };

    onSubmit = event => {
        const form = event.currentTarget
        event.preventDefault()
        event.stopPropagation()
        if (form.checkValidity())
            this.handleEditClicked();
    };

    handleEditClicked = () => {
        let employeeToEdit = {
            id: this.props.employeeToEdit.id,
            firstName: this.state.firstName ? this.state.firstName : this.props.employeeToEdit.firstName,
            lastName: this.state.lastName ? this.state.lastName : this.props.employeeToEdit.lastName,
            services: Array.from(this.state.checkedServices)
        }
        this.props.onClick(employeeToEdit);
    };

    getModalBody() {
        if (this.props.employeeToEdit) {
            return <div>
                <Form.Group controlId="firstName">
                    <Form.Label className={styles.formLabel}>First name</Form.Label>
                    <Form.Control required type="text" defaultValue={this.props.employeeToEdit?.firstName}
                                  onChange={event => this.handleChange(event)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter employee's first name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="lastName">
                    <Form.Label className={styles.formLabel}>Last name</Form.Label>
                    <Form.Control required type="text" defaultValue={this.props.employeeToEdit?.lastName}
                                  onChange={event => this.handleChange(event)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter employee's last name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="services">
                    <Form.Label className={styles.formLabel}>Services</Form.Label>
                    {
                        this.renderServices()
                    }
                </Form.Group>
            </div>;
        } else {
            return <>
                No employee selected.
            </>;
        }
    }

    renderServices() {
        if (this.state.error) {
            return <Form.Control plaintext readOnly defaultValue="Error"/>
        } else if (!this.state.isLoaded) {
            return <Form.Control plaintext readOnly defaultValue="Loading..."/>
        } else {
            return this.state.services.map(service =>
                <Form.Check id={service.name} key={service.name} className={styles.formCheckbox}
                            type="checkbox" label={service.name}
                            checked={this.state.checkedServices.has(service.name)}
                            onChange={event => this.handleServiceChange(event)}/>
            );
        }
    }

    handleServiceChange(event) {
        const checkedServices = this.state.checkedServices
        const eventId = event.target.id
        if (event.target.checked) checkedServices.add(eventId)
        else checkedServices.delete(eventId)
        this.setState({checkedServices: checkedServices});
    };

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value})
    }
}

export default EditEmployeeModal;
