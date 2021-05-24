import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomerRegistrationForm from "./CustomerRegistrationForm";
import ServiceProviderRegistrationForm from "./ServiceProviderRegistrationForm";
import styles from "./Registration.module.scss";
import authStyles from "../common/authentication/Authentication.module.scss";
import Carousel from "react-bootstrap/Carousel";
import {Alert} from "react-bootstrap";
import {backendHost} from "../Config";

const notClickedButtonColor = '#FDAAAF';
const clickedButtonColor = '#F85F6A';

class Registration extends Component {

    state = {
        width: window.innerWidth,
        height: window.innerHeight,
        salonButtonClicked: false,
        featuredSalons: [
            {
                name: "",
                imageUrl: "https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg"
            },
            {
                name: "",
                imageUrl: "https://welpmagazine.com/wp-content/uploads/2020/10/Filament-hair-salon1.jpg"
            },
            {
                name: "",
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
        this.handlePasswordsValidation(event);
        const form = this.state.form
        this.setState({
            form: {
                ...form,
                [event.target.id]: event.target.value
            }
        });
    };

    handlePasswordsValidation(event) {
        if (event.target.id === 'repeatPassword')
            if (event.target.value === this.state.form?.password)
                event.target.setCustomValidity('')
            else
                event.target.setCustomValidity('passwords_mismatch')
    }

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.handleSignUpClicked();
        }
    };

    handleSignUpClicked(event) {
        const form = event.currentTarget
        event.preventDefault()
        event.stopPropagation()
        if (form.checkValidity())
            this.registerUser();
    };

    registerUser() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.form)
        }
        const endpoint = this.state.salonButtonClicked ? '/register-service-provider' : '/register-customer'
        fetch(`${backendHost}${endpoint}`, requestOptions)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText)
            })
            .then(() => this.props.history.push("/login"))
            .catch(error => {
                console.log('error', error)
                this.setState({showError: true})
            })
    }

    render() {
        if (this.state.width > 900) {
            return <div>
                <Carousel className={authStyles.pictureBox}>
                    {this.state.featuredSalons.map(salon => this.getCarouselItem(salon.name, salon.imageUrl))}
                </Carousel>
                <div className={authStyles.desktopForm}>
                    <div className={authStyles.scrollbar} style={{height: '600px'}}>
                        {this.getRegistrationForm()}
                    </div>
                </div>
            </div>
        }
        return this.getRegistrationForm();
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

    getRegistrationForm() {
        return (
            <div>
                <div className={authStyles.companyName}>Reservatio</div>
                <div className={authStyles.formBox}>
                    <div className={authStyles.formTitle}>Sign up</div>
                    <ButtonGroup className={styles.btnGroup}>
                        <Button className={styles.btnGroupBtn}
                                onClick={this.handleClientClick}
                                style={{backgroundColor: this.state.salonButtonClicked ? notClickedButtonColor : clickedButtonColor}}>Customer</Button>
                        <Button className={styles.btnGroupBtn}
                                onClick={this.handleSalonClick}
                                style={{backgroundColor: this.state.salonButtonClicked ? clickedButtonColor : notClickedButtonColor}}>Salon</Button>
                    </ButtonGroup>
                    {this.state.salonButtonClicked ?
                        <ServiceProviderRegistrationForm handleChange={this.handleChange}
                                                         handleKeyDown={this.handleKeyDown}
                                                         onSubmit={event => this.handleSignUpClicked(event)}/> :
                        <CustomerRegistrationForm handleChange={this.handleChange} handleKeyDown={this.handleKeyDown}
                                                  onSubmit={event => this.handleSignUpClicked(event)}/>
                    }
                    {
                        this.state.showError &&
                        <Alert className="mt-2" variant="danger" onClose={() => this.setState({showError: false})} dismissible>
                            <span>The registration could not be performed. For support contact us at </span>
                            <a href="mailto:support@reservatio.com">support@reservatio.com</a>
                            <span>.</span>
                        </Alert>
                    }

                </div>
                <div className={authStyles.link}>Have an account? <a href={"/login"}>Sign in</a></div>
            </div>
        );
    }
}

export default Registration;
