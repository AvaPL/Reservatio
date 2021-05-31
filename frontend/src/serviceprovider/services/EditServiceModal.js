import React, {Component} from 'react';
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";
import {Button, Modal} from "react-bootstrap";
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
            name: null,
            validated: false
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
                onShow={this.handleShow}
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
                <Form noValidate validated={this.state.validated} onSubmit={this.onSubmit}>
                    <Modal.Body>
                        {this.getModalBody()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className={`${styles.buttonSecondary} shadow-none`}
                                onClick={this.handleHide}>Cancel</Button>
                        <Button className={`${styles.buttonPrimary} shadow-none`} type="submit"
                                disabled={!this.props.serviceToEdit}
                                onClick={() => this.setState({validated: true})}>Edit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }

    handleShow = () => {
        const checkedEmployees = this.state.checkedEmployees
        this.props.serviceToEdit?.employees.forEach(employee => checkedEmployees.add(employee.name))
        this.setState({checkedEmployees: checkedEmployees});
    };

    handleHide = () => {
        this.setState({checkedEmployees: new Set()})
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
        let serviceToEdit = {
            id: this.props.serviceToEdit.id,
            name: this.state.name ? this.state.name : this.props.serviceToEdit.name,
            description: this.state.description ? this.state.description : this.props.serviceToEdit.description,
            priceUsd: this.state.priceUsd ? this.state.priceUsd : this.props.serviceToEdit.priceUsd,
            durationMinutes: this.state.durationMinutes ? this.state.durationMinutes : this.props.serviceToEdit.durationMinutes,
            employees: Array.from(this.state.checkedEmployees)
        }
        this.props.onClick(serviceToEdit);
    };

    getModalBody() {
        if (this.props.serviceToEdit) {
            return <div>
                <Form.Group controlId="name">
                    <Form.Label className={styles.formLabel}>Name</Form.Label>
                    <Form.Control required type="text" defaultValue={this.props.serviceToEdit?.name}
                                  onChange={event => this.handleChange(event)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter a name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label className={styles.formLabel}>Description</Form.Label>
                    <Form.Control required type="text" defaultValue={this.props.serviceToEdit?.description}
                                  onChange={event => this.handleChange(event)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter a description.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="priceUsd">
                    <Form.Label className={styles.formLabel}>Price (USD)</Form.Label>
                    <Form.Control required min={0} step={0.01} type="number"
                                  defaultValue={this.props.serviceToEdit?.priceUsd}
                                  onChange={event => this.handleChange(event)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter a correct price.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="durationMinutes">
                    <Form.Label className={styles.formLabel}>Duration (minutes)</Form.Label>
                    <Form.Control required min={0} step={1} type="number"
                                  defaultValue={this.props.serviceToEdit?.durationMinutes}
                                  onChange={event => this.handleChange(event)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter duration in minutes.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="employees">
                    <Form.Label className={styles.formLabel}>Employees</Form.Label>
                    {
                        this.renderEmployees()
                    }
                </Form.Group>
            </div>;
        } else {
            return <>
                No service selected.
            </>;
        }
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value})
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
}

export default EditServiceModal;
