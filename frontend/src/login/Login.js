import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Carousel from "react-bootstrap/Carousel";
import styles from "./Login.module.scss"
import authStyles from "../common/authentication/Authentication.module.scss";
import {authService} from "../auth/AuthService";
import {Alert} from "react-bootstrap";

class Login extends Component {

    state = {
        width: window.innerWidth,
        height: window.innerHeight,
        featuredSalons: [
            {
                name: "uBasi",
                imageUrl: "https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg"
            },
            {
                name: "Cool salon",
                imageUrl: "https://welpmagazine.com/wp-content/uploads/2020/10/Filament-hair-salon1.jpg"
            },
            {
                name: "Another salon",
                imageUrl: "https://www.triss.com.pl/wp-content/uploads/granat-2768U-1.jpg"
            }
        ],
        showError: false
    };

    updateDimensions = () => {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.handleSignInClicked();
        }
    };

    handleSignInClicked = () => {
        const login = authService.login(this.state.email, this.state.password)
        login.then(loggedIn => {
            if (loggedIn)
                this.props.onLogin()
            else
                this.setState({showError: true})
        })
    };

    render() {
        if (this.state.width > 900) {
            return <div>
                <Carousel className={authStyles.pictureBox}>
                    {this.state.featuredSalons.map(salon => this.getCarouselItem(salon.name, salon.imageUrl))}
                </Carousel>
                <div className={authStyles.desktopForm}>
                    {this.getLoginForm()}
                </div>
            </div>
        }
        return this.getLoginForm();
    }

    getCarouselItem(name, imageUrl) {
        return <Carousel.Item key={name}>
            <img
                className="img-responsive d-block "
                height={600}
                src={imageUrl}
                alt="First slide"
            />
            <Carousel.Caption>
                <h3>{name}</h3>
            </Carousel.Caption>
        </Carousel.Item>;
    }

    getLoginForm() {
        return (
            <div>
                <div className={authStyles.companyName}>Reservatio</div>
                <div className={authStyles.formBox}>
                    <div className={authStyles.formTitle}>Sign in</div>
                    <div className={styles.formSubtitle}>Hi there! Nice to see you again.</div>
                    <Form className={authStyles.form}>
                        <Form.Group controlId="email">
                            <Form.Label className={authStyles.formLabel}>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={this.handleChange}
                                          onKeyDown={this.handleKeyDown}/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label className={authStyles.formLabel}>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={this.handleChange}
                                          onKeyDown={this.handleKeyDown}/>
                        </Form.Group>
                    </Form>
                    {
                        this.state.showError &&
                        <Alert variant="danger" onClose={() => this.setState({showError: false})} dismissible>
                            <span>Invalid username or password. For support contact us at </span>
                            <a href="mailto:support@reservatio.com">support@reservatio.com</a>
                            <span>.</span>
                        </Alert>
                    }
                    <Button className={authStyles.button} type="submit" onClick={this.handleSignInClicked}>
                        Sign in
                    </Button>
                </div>
                <div className={authStyles.link}><a href={"/register"}>Sign up</a></div>
            </div>
        );
    }
}

export default Login;