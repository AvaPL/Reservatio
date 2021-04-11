import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

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
        this.fetchEmployees().then(this.processEmployees(), this.handleError());
    }

    fetchEmployees() {
        //TODO: get from currently logged user
        const serviceProviderId = 1;
        return authService.fetchAuthenticated(`${backendHost}/rest/serviceProviderEmployeesViews/${serviceProviderId}`)
            // TODO: Check response status here
            .then(res => res.json()).then(res => res.services);
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
                    <Modal.Title id="contained-modal-title-vcenter" className="employees-form-title">
                        Add new employee
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="firstName">
                            <Form.Label className="employees-form-label">First name</Form.Label>
                            <Form.Control type="text" placeholder="First name"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label className="employees-form-label">Last name</Form.Label>
                            <Form.Control type="text" placeholder="Last name"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="services">
                            <Form.Label className="employees-form-label">Services</Form.Label>
                            {
                                this.renderServices()
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="employees-button-secondary shadow-none"
                            onClick={this.props.onHide}>Cancel</Button>
                    <Button className="employees-button-primary shadow-none"
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
                <Form.Check id={service.name} key={service.name} className="employees-form-checkbox"
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