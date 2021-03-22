import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./Login.scss";

class Login extends Component {

    state = {
        width: 0,
        height: 0,
        imageUrl: "https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg"
    };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        let mql = window.matchMedia('(min-width: 900px)');
        if (mql.matches) {
            return <div>
                <div className="Login-picture-box">
                    <img
                        src={this.state.imageUrl}
                        alt={"hairdresser"}
                        style={{height: '100%', width: '100%', objectFit: 'contain'}}/>
                </div>
                <div className="Login-desktop-form">
                {this.getLoginForm()}
                </div>
            </div>
        }
        return this.getLoginForm();
    }

    getLoginForm() {
        return (
            <div>
                <div className="Login-company-name">Reservatio</div>
                <div className="Login-form-box">
                    <div className="Login-form-title">Sign in</div>
                    <div className="Login-form-subtitle">Hi there! Nice to see you again.</div>
                    <Form className="Login-form">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="Login-form-label">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email"/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="Login-form-label">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"/>
                        </Form.Group>
                        <Button className="btn-reservatio" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
                <a href={"/register"}>Sign up</a>
            </div>
        );
    }
}

export default Login;