import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";

export class AddEmployeeModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            checkedServices: new Set()
        }
    }

    /* TODO: Replace Auth classes with dedicated ones */

    /* TODO: Change fonts */

    render() {
        const services = [{name: "Service A"}, {name: "Service B"}, {name: "Service C"}]
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
                                services.map(service =>
                                    <Form.Check id={service.name} key={service.name} className="employees-form-checkbox"
                                                type="checkbox" label={service.name}
                                                onChange={event => this.handleServiceChange(event)}/>
                                )
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="employees-button-secondary shadow-none"
                            onClick={this.props.onHide}>Cancel</Button>
                    <Button className="employees-button-primary shadow-none"
                            onClick={() => this.props.onClick(this.state)}>Add</Button>
                </Modal.Footer>
            </Modal>
        );
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