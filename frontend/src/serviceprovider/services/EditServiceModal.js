import React, {Component} from 'react';
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";
import {Alert, Button, Modal} from "react-bootstrap";
import styles from "./Services.module.scss";
import Form from "react-bootstrap/Form";

class EditServiceModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            employees: [],
            checkedEmployees: new Set(),
            error: null,
            isLoaded: false,
            formErrors: new Set(),
            name: null
        }
        this.props.serviceToEdit?.employees.forEach(employee => this.state.checkedEmployees.add(employee.name))
    }

    componentDidMount() {
        this.fetchEmployees().then(this.processEmployees(), this.handleError());
    }

    fetchEmployees() {
        const serviceProviderId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/serviceProviderServicesViews/${serviceProviderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(response => response.employees);
    }

    processEmployees() {
        return employees => {
            this.setState({
                isLoaded: true,
                employees: employees
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
                onHide={this.handleHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className={styles.formTitle}>
                        Edit service
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {this.alerts()}
                        <Form.Group controlId="name">
                            <Form.Label className={styles.formLabel}>Name</Form.Label>
                            <Form.Control type="text" defaultValue={this.props.serviceToEdit?.name}
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label className={styles.formLabel}>Description</Form.Label>
                            <Form.Control type="text" defaultValue={this.props.serviceToEdit?.description}
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="price">
                            <Form.Label className={styles.formLabel}>Price</Form.Label>
                            <Form.Control type="number" defaultValue={this.props.serviceToEdit?.price}
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="duration">
                            <Form.Label className={styles.formLabel}>Duration</Form.Label>
                            <Form.Control type="number" defaultValue={this.props.serviceToEdit?.duration}
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="employees">
                            <Form.Label className={styles.formLabel}>Employees</Form.Label>
                            {
                                this.renderEmployees()
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${styles.buttonSecondary} shadow-none`}
                            onClick={this.handleHide}>Cancel</Button>
                    <Button className={`${styles.buttonPrimary} shadow-none`} disabled={this.state.formErrors.size > 0}
                            onClick={this.handleEditClicked}>Edit</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    alerts() {
        if (this.state.formErrors.size > 0) {
            return <Alert variant="danger">
                {Array.from(this.state.formErrors).join(", ")}
            </Alert>
        }
    }

    handleChange(event) {
        let formErrors = this.state.formErrors
        if (event.target.id === "price") {
            if (event.target.value < 0)
                formErrors.add("Price cannot be lower than 0")
            else
                formErrors.delete("Price cannot be lower than 0")
        }
        if (event.target.id === "duration") {
            if (event.target.value < 0)
                formErrors.add("Duration cannot be lower than 0")
            else
                formErrors.delete("Duration cannot be lower than 0")
            if (Number(event.target.value) % 1 !== 0)
                formErrors.add("Duration must be an integer")
            else
                formErrors.delete("Duration must be an integer")
        }
        this.setState({formErrors: formErrors, [event.target.id]: event.target.value});
    }

    renderEmployees() {
        console.log(this.state.checkedEmployees)
        if (this.state.error) {
            return <Form.Control plaintext readOnly defaultValue="Error"/>
        } else if (!this.state.isLoaded) {
            return <Form.Control plaintext readOnly defaultValue="Loading..."/>
        } else {
            return this.state.employees.map(employee =>
                <Form.Check id={employee.name} key={employee.name} className={styles.formCheckbox}
                            type="checkbox" label={employee.name}
                            checked={this.state.checkedEmployees.has(employee.name)}
                            onChange={event => this.handleEmployeeChange(event)}/>
            );
        }
    }

    handleEmployeeChange(event) {
        const checkedEmployees = this.state.checkedEmployees
        const eventId = event.target.id
        if (event.target.checked) checkedEmployees.add(eventId)
        else checkedEmployees.delete(eventId)
        this.setState({checkedEmployees: checkedEmployees});
    };

    handleHide = () => {
        let checkedEmployees = new Set();
        this.props.serviceToEdit.employees.forEach(employee => checkedEmployees.add(employee.name))
        this.setState({checkedEmployees: checkedEmployees})
        this.props.onHide();
    };

    handleEditClicked = () => {
        if (!this.state.formErrors.size > 0) {
            let serviceToEdit = {
                name: this.state.name ? this.state.name : this.props.serviceToEdit.name,
                description: this.state.description ? this.state.description : this.props.serviceToEdit.description,
                price: this.state.price ? this.state.price : this.props.serviceToEdit.price,
                duration: this.state.duration ? this.state.duration : this.props.serviceToEdit.duration,
                employees: Array.from(this.state.checkedEmployees)
            }
            this.props.onClick(serviceToEdit);
            this.setState({checkedEmployees: new Set()})
        }
    };
}

export default EditServiceModal;