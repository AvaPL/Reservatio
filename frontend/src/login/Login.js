import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../stylesheets/Authentication.scss";

class Login extends Component {

    state = {
        width: window.innerWidth,
        height: window.innerHeight,
        imageUrl: "https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg"
    };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    };

    render() {
        if (this.state.width>900) {
            return <div>
                <div className="Auth-picture-box">
                    <img
                        src={this.state.imageUrl}
                        alt={"hairdresser"}
                        style={{height: '100%', width: '100%', objectFit: 'contain'}}/>
                </div>
                <div className="Auth-desktop-form">
                {this.getLoginForm()}
                </div>
            </div>
        }
        return this.getLoginForm();
    }

    getLoginForm() {
        return (
            <div>
                <div className="Auth-company-name">Reservatio</div>
                <div className="Auth-form-box">
                    <div className="Auth-form-title">Sign in</div>
                    <div className="Auth-form-subtitle">Hi there! Nice to see you again.</div>
                    <Form className="Auth-form">
                        <Form.Group controlId="email">
                            <Form.Label className="Auth-form-label">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"/>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label className="Auth-form-label">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"/>
                        </Form.Group>
                        <Button className="btn-reservatio shadow-none" type="submit">
                            Sign in
                        </Button>
                    </Form>
                </div>
                <div className="Auth-link"><a href={"/register"}>Sign up</a></div>
            </div>
        );
    }
}

export default Login;