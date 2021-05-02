import React, {Component} from 'react';
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";

class AddServiceModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            employees: ["Employee A", "Employee B", "Employee C"],
            checkedEmployees: new Set(),
            error: null,
            isLoaded: true, // TODO: should be false at first
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
                        Add new service
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label className="employees-form-label">Name</Form.Label>
                            <Form.Control type="text" placeholder="Name"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label className="employees-form-label">Description</Form.Label>
                            <Form.Control type="text" placeholder="Description"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        {/*TODO: only accept number*/}
                        <Form.Group controlId="price">
                            <Form.Label className="employees-form-label">Price</Form.Label>
                            <Form.Control type="number" placeholder="Price"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        {/*TODO: only accept number*/}
                        <Form.Group controlId="duration">
                            <Form.Label className="employees-form-label">Duration</Form.Label>
                            <Form.Control type="number" placeholder="Duration"
                                          onChange={event => this.handleChange(event)}/>
                        </Form.Group>
                        <Form.Group controlId="employees">
                            <Form.Label className="employees-form-label">Employees</Form.Label>
                            {
                                this.renderEmployees()
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
        let serviceToAdd = {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            duration: this.state.duration,
            services: Array.from(this.state.checkedEmployees)
        }
        this.props.onClick(serviceToAdd);
        this.setState({checkedEmployees: new Set()})
    };

    renderEmployees() {
        if (this.state.error) {
            return <Form.Control plaintext readOnly defaultValue="Error"/>
        } else if (!this.state.isLoaded) {
            return <Form.Control plaintext readOnly defaultValue="Loading..."/>
        } else {
            return this.state.employees.map(service =>
                <Form.Check id={service} key={service} className="employees-form-checkbox"
                            type="checkbox" label={service}
                            onChange={event => this.handleServiceChange(event)}/>
            );
        }
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value})
    }

    handleServiceChange(event) {
        const checkedEmployees = this.state.checkedEmployees
        const eventId = event.target.id
        if (event.target.checked) checkedEmployees.add(eventId)
        else checkedEmployees.delete(eventId)
        this.setState({checkedEmployees: checkedEmployees});
    };
}

export default AddServiceModal;