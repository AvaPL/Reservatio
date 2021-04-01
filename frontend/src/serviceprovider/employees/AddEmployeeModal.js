import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import * as PropTypes from "prop-types";

export class AddEmployeeModal extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <Modal
            show={this.props.show}
            onHide={this.props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            {/* TODO: Replace Auth classes with dedicated ones */}
            <Modal.Header closeButton>
                {{/* TODO: Change fonts */}}
                <Modal.Title id="contained-modal-title-vcenter" className="Auth-form-title">
                    Add new employee
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="firstName">
                        <Form.Label className="Auth-form-label">First name</Form.Label>
                        <Form.Control type="text" placeholder="First name" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label className="Auth-form-label">Last name</Form.Label>
                        <Form.Control type="text" placeholder="Last name" onChange={this.handleChange}/>
                    </Form.Group>
                    {/* TODO: Handle checkboxes change */}
                    <Form.Group controlId="services">
                        <Form.Label className="Auth-form-label">Services</Form.Label>
                        <Form.Check className="Auth-checkbox" type="checkbox" label="Service A"/>
                        <Form.Check className="Auth-checkbox" type="checkbox" label="Service B"/>
                        <Form.Check className="Auth-checkbox" type="checkbox" label="Service C"/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="employees-button-secondary shadow-none"
                        onClick={this.props.onHide}>Cancel</Button>
                <Button className="employees-button-primary shadow-none"
                        onClick={this.props.onClick}>Add</Button>
            </Modal.Footer>
        </Modal>;
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
    };
}