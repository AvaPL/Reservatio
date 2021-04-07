import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomerRegistrationForm from "./CustomerRegistrationForm";
import ServiceProviderRegistrationForm from "./ServiceProviderRegistrationForm";
import "../stylesheets/Authentication.scss";
import Carousel from "react-bootstrap/Carousel";
import {Alert} from "react-bootstrap";

let notClickedButtonColor = '#FDAAAF';
let clickedButtonColor = '#F85F6A';

class Registration extends Component {

    state = {
        width: window.innerWidth,
        height: window.innerHeight,
        salonButtonClicked: false,
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

    handleClientClick = () => {
        this.setState({
            salonButtonClicked: false
        })
    };

    handleSalonClick = () => {
        this.setState({
            salonButtonClicked: true
        })
    };

    handleChange = event => {
        const form = this.state.form
        this.setState({
            form: {
                ...form,
                [event.target.id]: event.target.value
            }
        });
    };

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.handleSignUpClicked();
        }
    };

    handleSignUpClicked = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.form)
        }
        const endpoint = this.state.salonButtonClicked ? '/register-service-provider' : '/register-customer' // TODO: Load from env
        fetch('http://localhost:8080' + endpoint, requestOptions) // TODO: Load host from env
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText)
            })
            .then(() => this.props.history.push("/login"))
            .catch(error => {
                console.log(error)
                this.setState({showError: true})
            })
    };

    render() {
        if (this.state.width > 900) {
            return <div>
                <Carousel className="Auth-picture-box">
                    {this.state.featuredSalons.map(salon => this.getCarouselItem(salon.name, salon.imageUrl))}
                </Carousel>
                <div className="Auth-desktop-form">
                    <div className="overflow-auto scrollbar" style={{height: '600px'}}>
                        {this.getRegistrationForm()}
                    </div>
                </div>
            </div>
        }
        return this.getRegistrationForm();
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

    getRegistrationForm() {
        return (
            <div>
                <div className="Auth-company-name">Reservatio</div>
                <div className="Auth-form-box">
                    <div className="Auth-form-title">Sign up</div>
                    <ButtonGroup className="Auth-btn-group">
                        <Button className="Auth-btn-group-btn shadow-none"
                                onClick={this.handleClientClick}
                                style={{backgroundColor: this.state.salonButtonClicked ? notClickedButtonColor : clickedButtonColor}}>Client</Button>
                        <Button className="Auth-btn-group-btn shadow-none"
                                onClick={this.handleSalonClick}
                                style={{backgroundColor: this.state.salonButtonClicked ? clickedButtonColor : notClickedButtonColor}}>Salon</Button>
                    </ButtonGroup>
                    {this.state.salonButtonClicked ?
                        <ServiceProviderRegistrationForm handleChange={this.handleChange}
                                                         handleKeyDown={this.handleKeyDown}/> :
                        <CustomerRegistrationForm handleChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>
                    }
                    {
                        this.state.showError &&
                        <Alert variant="danger" onClose={() => this.setState({showError: false})} dismissible>
                            <span>The registration could not be performed. Please contact us at </span>
                            <a href="mailto:customer-support@reservatio.com">customer-support@reservatio.com</a>.
                        </Alert>
                    }
                    <Button className="btn-reservatio shadow-none" type="submit"
                            onClick={this.handleSignUpClicked}>
                        Submit
                    </Button>
                </div>
                <div className="Auth-link">Have an account? <a href={"/login"}>Sign in</a></div>
            </div>
        );
    }
}

export default Registration;