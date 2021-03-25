import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Carousel from "react-bootstrap/Carousel";
import "../stylesheets/Authentication.scss";

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
        ]
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
        console.log(this.state);
    };

    render() {
        if (this.state.width > 900) {
            return <div>
                <Carousel className="Auth-picture-box">
                    {this.state.featuredSalons.map(salon => this.getCarouselItem(salon.name, salon.imageUrl))}
                </Carousel>
                <div className="Auth-desktop-form">
                    {this.getLoginForm()}
                </div>
            </div>
        }
        return this.getLoginForm();
    }

    getCarouselItem(name, imageUrl) {
        return <Carousel.Item>
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
                <div className="Auth-company-name">Reservatio</div>
                <div className="Auth-form-box">
                    <div className="Auth-form-title">Sign in</div>
                    <div className="Auth-form-subtitle">Hi there! Nice to see you again.</div>
                    <Form className="Auth-form">
                        <Form.Group controlId="email">
                            <Form.Label className="Auth-form-label">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={this.handleChange}
                                          onKeyDown={this.handleKeyDown}/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label className="Auth-form-label">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={this.handleChange}
                                          onKeyDown={this.handleKeyDown}/>
                        </Form.Group>
                    </Form>
                    <Button className="btn-reservatio shadow-none" type="submit" onClick={this.handleSignInClicked}>
                        Sign in
                    </Button>
                </div>
                <div className="Auth-link"><a href={"/register"}>Sign up</a></div>
            </div>
        );
    }
}

export default Login;