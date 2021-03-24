import React, {Component} from 'react';
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomerRegistrationForm from "./CustomerRegistrationForm";
import ServiceProviderRegistrationForm from "./ServiceProviderRegistrationForm";
import "../stylesheets/Authentication.scss";

let notClickedButtonColor = '#FDAAAF';
let clickedButtonColor = '#F85F6A';

class Registration extends Component {

    state = {
        width: window.innerWidth,
        height: window.innerHeight,
        imageUrl: "https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg",
        clientButtonColor: notClickedButtonColor,
        salonButtonColor: notClickedButtonColor,
        clientButtonClicked: false,
        salonButtonClicked: false,
        submitButtonDisabled: true
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
            clientButtonColor: clickedButtonColor,
            salonButtonColor: notClickedButtonColor,
            clientButtonClicked: true,
            salonButtonClicked: false,
            submitButtonDisabled: false
        })
    };

    handleSalonClick = () => {
        this.setState({
            clientButtonColor: notClickedButtonColor,
            salonButtonColor: clickedButtonColor,
            clientButtonClicked: false,
            salonButtonClicked: true,
            submitButtonDisabled: false
        })
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleKeyDown = event => {
        if (event.key === 'Enter') {
            this.handleSignUpClicked();
        }
    };

    handleSignUpClicked = () => {
        console.log(this.state);
    };

    render() {
        if (this.state.width > 900) {
            return <div>
                <div className="Auth-picture-box">
                    <img
                        src={this.state.imageUrl}
                        alt={"hairdresser"}
                        style={{height: '100%', width: '100%', objectFit: 'contain'}}/>
                </div>
                <div className="Auth-desktop-form">
                    <div className="overflow-auto scrollbar" style={{height: '600px'}}>
                        {this.getRegistrationForm()}
                    </div>
                </div>
            </div>
        }
        return this.getRegistrationForm();
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
                                style={{backgroundColor: this.state.clientButtonColor}}>Client</Button>
                        <Button className="Auth-btn-group-btn shadow-none"
                                onClick={this.handleSalonClick}
                                style={{backgroundColor: this.state.salonButtonColor}}>Salon</Button>
                    </ButtonGroup>
                    {this.state.clientButtonClicked &&
                    <CustomerRegistrationForm handleChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>}
                    {this.state.salonButtonClicked &&
                    <ServiceProviderRegistrationForm handleChange={this.handleChange} handleKeyDown={this.handleKeyDown}/>}
                    <Button className="btn-reservatio shadow-none" type="submit"
                            disabled={this.state.submitButtonDisabled} onClick={this.handleSignUpClicked}>
                        Submit
                    </Button>
                </div>
                <div className="Auth-link">Have an account? <a href={"/login"}>Sign in</a></div>
            </div>
        );
    }
}

export default Registration;