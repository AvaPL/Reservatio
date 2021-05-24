import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import styles from "./Registration.module.scss";
import authStyles from "../common/authentication/Authentication.module.scss";
import Button from "react-bootstrap/Button";

class CustomerRegistrationForm extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            validated: false
        }
    }

    render() {
        return (
            <div>
                <Form noValidate validated={this.state.validated} onSubmit={this.props.onSubmit}
                      className={authStyles.form}>
                    <Form.Group controlId="firstName">
                        <Form.Label className={authStyles.formLabel}>First name</Form.Label>
                        <Form.Control required maxLength={50} type="text" placeholder="Enter your name"
                                      onChange={this.props.handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            Please enter your first name.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label className={authStyles.formLabel}>Last name</Form.Label>
                        <Form.Control required maxLength={50} type="text" placeholder="Enter your last name"
                                      onChange={this.props.handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            Please enter your last name.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label className={authStyles.formLabel}>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email"
                                      onChange={this.props.handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email address.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label className={authStyles.formLabel}>Phone number</Form.Label>
                        <Form.Control required maxLength={30} pattern="\+?\d+" type="text"
                                      placeholder="Enter phone number"
                                      onChange={this.props.handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid phone number.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className={authStyles.formLabel}>Password</Form.Label>
                        <Form.Control required minLength={8} type="password" placeholder="Password"
                                      onChange={this.props.handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            A valid password must contain at least 8 characters.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="repeatPassword">
                        <Form.Label className={authStyles.formLabel}>Repeat password</Form.Label>
                        <Form.Control required type="password" placeholder="Repeat password"
                                      onChange={this.props.handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            Password does not match the one above.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="agreeToTerms">
                        <Form.Check required type="checkbox" className={styles.checkbox}
                                    label="I agree to the Terms of Services and Privacy Policy."
                                    onChange={this.props.handleChange}/>
                    </Form.Group>
                    <Button className={authStyles.button} type="submit"
                            onClick={() => this.setState({validated: true})}>Submit</Button>
                </Form>
            </div>
        );
    }
}

export default CustomerRegistrationForm;
