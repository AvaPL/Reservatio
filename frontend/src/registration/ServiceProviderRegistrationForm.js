import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import "../stylesheets/Authentication.scss";


class ServiceProviderRegistrationForm extends Component {
    render() {
        return (
            <div>
                <Form className="Auth-form">
                    <Form.Group controlId="name">
                        <Form.Label className="Auth-form-label">Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label className="Auth-form-label">Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label className="Auth-form-label">Phone number</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone number" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="city">
                        <Form.Label className="Auth-form-label">City</Form.Label>
                        <Form.Control type="text" placeholder="Enter city" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="postCode">
                        <Form.Label className="Auth-form-label">Post code</Form.Label>
                        <Form.Control type="text" placeholder="Enter post code" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="street">
                        <Form.Label className="Auth-form-label">Street name</Form.Label>
                        <Form.Control type="text" placeholder="Enter street name" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="propertyNumber">
                        <Form.Label className="Auth-form-label">Property number</Form.Label>
                        <Form.Control type="text" placeholder="Enter property number" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className="Auth-form-label">Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="repeatPassword">
                        <Form.Label className="Auth-form-label">Repeat password</Form.Label>
                        <Form.Control type="password" placeholder="Repeat password" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="agreeToTerms">
                        <Form.Check type="checkbox" className="Auth-checkbox"
                                    label="I agree to the Terms of Services and Privacy Policy."
                                    onChange={this.props.handleChange} onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default ServiceProviderRegistrationForm;