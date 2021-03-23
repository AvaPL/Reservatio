import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../stylesheets/Authentication.scss";


class ServiceProviderRegistrationForm extends Component {
    render() {
        return (
            <div>
                <Form className="Auth-form">
                    <Form.Group controlId="name">
                        <Form.Label className="Auth-form-label">Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name"/>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label className="Auth-form-label">Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"/>
                    </Form.Group>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label className="Auth-form-label">Phone number</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone number"/>
                    </Form.Group>
                    <Form.Group controlId="address">
                        <Form.Label className="Auth-form-label">Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter address"/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className="Auth-form-label">Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"/>
                    </Form.Group>
                    <Form.Group controlId="repeatPassword">
                        <Form.Label className="Auth-form-label">Repeat password</Form.Label>
                        <Form.Control type="password" placeholder="Repeat password"/>
                    </Form.Group>
                    <Form.Group controlId="checkbox">
                        <Form.Check type="checkbox" className="Auth-checkbox" label="I agree to the Terms of Services and Privacy Policy." />
                    </Form.Group>
                    <Button className="btn-reservatio shadow-none" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default ServiceProviderRegistrationForm;