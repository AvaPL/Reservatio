import React, {Component} from 'react';
import {Alert, Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import styles from "./Services.module.scss";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class AddServiceModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            employees: [],
            checkedEmployees: new Set(),
            error: null,
            isLoaded: false,
            formErrors: new Set()
        }
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
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className={styles.formTitle}>
                        Add new service
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {this.alerts()}
                        <Form.Group controlId="name">
                            <Form.Label className={styles.formLabel}>Name</Form.Label>
                            <Form.Control type="text" placeholder="Name"
                                          onChange={event => this.props.handleChange(event, this)}/>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label className={styles.formLabel}>Description</Form.Label>
                            <Form.Control type="text" placeholder="Description"
                                          onChange={event => this.props.handleChange(event, this)}/>
                        </Form.Group>
                        <Form.Group controlId="priceUsd">
                            <Form.Label className={styles.formLabel}>Price (USD)</Form.Label>
                            <Form.Control type="number" placeholder="Price (USD)"
                                          onChange={event => this.props.handleChange(event, this)}/>
                        </Form.Group>
                        <Form.Group controlId="durationMinutes">
                            <Form.Label className={styles.formLabel}>Duration (minutes)</Form.Label>
                            <Form.Control type="number" placeholder="Duration (minutes)"
                                          onChange={event => this.props.handleChange(event, this)}/>
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
                            onClick={this.props.onHide}>Cancel</Button>
                    <Button className={`${styles.buttonPrimary} shadow-none`} disabled={this.state.formErrors.size > 0}
                            onClick={this.handleAddClicked}>Add</Button>
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

    renderEmployees() {
        if (this.state.error) {
            return <Form.Control plaintext readOnly defaultValue="Error"/>
        } else if (!this.state.isLoaded) {
            return <Form.Control plaintext readOnly defaultValue="Loading..."/>
        } else {
            return this.state.employees.map(employee =>
                <Form.Check id={employee.name} key={employee.name} className={styles.formCheckbox}
                            type="checkbox" label={employee.name}
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

    handleAddClicked = () => {
        if (!this.state.formErrors.size > 0) {
            let serviceToAdd = {
                name: this.state.name,
                description: this.state.description,
                priceUsd: this.state.priceUsd,
                durationMinutes: this.state.durationMinutes,
                employees: Array.from(this.state.checkedEmployees)
            }
            this.props.onClick(serviceToAdd);
            this.setState({checkedEmployees: new Set()})
        }
    };
}

export default AddServiceModal;