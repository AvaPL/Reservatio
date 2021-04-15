import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import styles from "./Registration.module.scss";
import authStyles from "../common/authentication/Authentication.module.scss";

class CustomerRegistrationForm extends Component {
    render() {
        return (
            <div>
                <Form className={authStyles.form}>
                    <Form.Group controlId="firstName">
                        <Form.Label className={authStyles.formLabel}>First name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your name" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label className={authStyles.formLabel}>Last name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your last name" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label className={authStyles.formLabel}>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label className={authStyles.formLabel}>Phone number</Form.Label>
                        <Form.Control type="text" placeholder="Enter phone number" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className={authStyles.formLabel}>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="repeatPassword">
                        <Form.Label className={authStyles.formLabel}>Repeat password</Form.Label>
                        <Form.Control type="password" placeholder="Repeat password" onChange={this.props.handleChange}
                                      onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                    <Form.Group controlId="agreeToTerms">
                        <Form.Check type="checkbox" className={styles.checkbox}
                                    label="I agree to the Terms of Services and Privacy Policy."
                                    onChange={this.props.handleChange} onKeyDown={this.props.handleKeyDown}/>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default CustomerRegistrationForm;