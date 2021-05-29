import React, {Component} from 'react';
import './Profile.scss';
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import authStyles from "../../common/authentication/Authentication.module.scss";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src : `http://localhost:9000/reservatio/serviceprovider${authService.token?.entityId}.jpg?=` + new Date().getTime(),
            alt: "photo",
            error: null,
            data: {},
            file : null,
            showModalChange : false,
            isLoaded : false,
            validated : false
        }
        this.changeSalonProfile = this.changeSalonProfile.bind(this);
        this.changePhoto = this.changePhoto.bind(this);
    }

    componentDidMount() {
        this.fetchSalon().then(this.processSalon(), this.handleError());
    }

    fetchSalon() {
        const serviceProviderId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/salonViews/${serviceProviderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
    }

    processSalon() {
        return data => {
            this.setState({
                data: data,
                isLoaded : true
            });
            console.log(data);
        };
    }

    handleError() {
        return error => {
            this.setState({
                error: error,
                isLoaded : true
            })
            console.log(error);
        }
    }

    changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    }

    clearData(){
        document.getElementById('1').value = '';
        document.getElementById('2').value = '';
        document.getElementById('3').value = '';
        document.getElementById('4').value = '';
        document.getElementById('5').value = '';
        document.getElementById('6').value = '';
        document.getElementById('7').value = '';
    }

    changePhoto(event){
        this.setState({
            file: event.target.files[0]
        })
    }

    addChangeModal(){
        return(
            <Modal
                show={this.state.showModalChange}
                onHide={() => this.setState({showModalChange: false})}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Photo
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="file" onChange={this.changePhoto}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="buttonSecondary shadow-none"
                            onClick={() => this.setState({showModalChange: false})}>Cancel</Button>
                    <Button className="buttonPrimary shadow-none" onClick={() => this.onChangeClicked()} >Change</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    onChangeClicked() {
        if (!this.state.file){
            alert("You didn't choose file!");
        }
        else{
            var formdata = new FormData();
            formdata.append("image", this.state.file, `serviceprovider${authService.token?.entityId}.jpg`)
            var requestOptions = {
                method: 'PATCH',
                body: formdata
            };
            this.setState({
                isLoaded: false
            });

            const serviceProviderId = authService.token?.entityId;
            authService.fetchAuthenticated(`${backendHost}/rest/uploadImage/${serviceProviderId}`, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response;
                })
                .then(result => {
                        console.log(result);
                        this.setState({
                            showModalChange: false,
                            src : `http://localhost:9000/reservatio/serviceprovider${authService.token?.entityId}.jpg?${global.Date.now()}`,
                            file: null,
                            isLoaded: true
                        });
                    }
                )
                .catch(error => console.log('error', error));
        }
    }

    addNamePhoto() {
        if (this.state.isLoaded)
            return (
                <div className={'salon-name-photo'}>
                    <div id = 'x' className="card bg-dark text-white">
                        <img className="card-img salon-photo" src={this.state.src}
                             id = 'image'
                             alt={this.state.alt}
                             onError={() => this.setState({src: 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'})}/>
                        <div className="card-img-overlay salon-photo-button-container">
                            <button className={'salon-photo-button'} onClick={() => this.setState({showModalChange: true})}> Change photo </button>
                        </div>
                    </div>
                    {this.addChangeModal()}
                </div>
            );
        else{
            return(<span className={'load'}>Loading...</span>);
        }
    }

    addAddress(){
        if (this.state.isLoaded)
        return(
            <div className={'salon-address'}>
                <Form className={'w-75'} noValidate validated={this.state.validated} onSubmit={this.onSubmit}>
                    <Form.Group controlId="1">
                        <Form.Label className={authStyles.formLabel}>Name:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="text" placeholder={this.state.data.name}
                                          onChange={event => this.changeHandler(event)}/>
                    </Form.Group>
                    <Form.Group controlId="2">
                        <Form.Label className={authStyles.formLabel}>City:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="text" placeholder={this.state.data.city}
                                          onChange={event => this.changeHandler(event)}/>
                    </Form.Group>
                    <Form.Group controlId="3">
                            <Form.Label className={authStyles.formLabel}>Post code:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="text" placeholder={this.state.data.post_code}
                                          onChange={event => this.changeHandler(event)}/>
                    </Form.Group>
                    <Form.Group controlId="4">
                        <Form.Label className={authStyles.formLabel}>Street:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="text" placeholder={this.state.data.street}
                                          onChange={event => this.changeHandler(event)}/>
                    </Form.Group>
                    <Form.Group controlId="5">
                        <Form.Label className={authStyles.formLabel}>Property number:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="text" placeholder={this.state.data.property_nr}
                                          onChange={event => this.changeHandler(event)}/>
                    </Form.Group>
                    <Form.Group controlId="6">
                        <Form.Label className={authStyles.formLabel}>Email:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="email" placeholder={this.state.data.email}
                                          onChange={event => this.changeHandler(event)}/>
                        <Form.Control.Feedback type="invalid">
                            Please enter valid email.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="7">
                        <Form.Label className={authStyles.formLabel}>Phone number:</Form.Label>
                            <Form.Control className={'salon-address-input'} type="text" maxLength={30} pattern="\+?\d+" placeholder={this.state.data.phone_nr}
                                          onChange={event => this.changeHandler(event)}/>
                            <Form.Control.Feedback type="invalid">
                                Please enter valid phone number.
                            </Form.Control.Feedback>
                    </Form.Group>
                    <div className={'button_address_holder'}>
                        <Button className={`buttonPrimary shadow-none`} type="submit"
                                onClick={() => this.setState({validated: true})}>Change info</Button>
                    </div>
                </Form>
            </div>
        );
    }

    onSubmit = event => {
        const form = event.currentTarget
        event.preventDefault()
        event.stopPropagation()

        if (form.checkValidity())
            this.changeSalonProfile();
    };

    changeSalonProfile(){
        let changeddata = {
            name : document.getElementById('1').value,
            phone_nr : document.getElementById('7').value,
            email : document.getElementById('6').value,
            street : document.getElementById('4').value,
            property_nr : document.getElementById('5').value,
            city : document.getElementById('2').value,
            post_code : document.getElementById('3').value,
        };
        if (changeddata.name === '') {
            changeddata.name = this.state.data.name;
        }
        if (changeddata.phone_nr === '') {
            changeddata.phone_nr = this.state.data.phone_nr;
        }
        if (changeddata.email === '') {
            changeddata.email = this.state.data.email;
        }
        if (changeddata.street === '') {
            changeddata.street = this.state.data.street;
        }
        if (changeddata.property_nr === '') {
            changeddata.property_nr = this.state.data.property_nr;
        }
        if (changeddata.city === '') {
            changeddata.city = this.state.data.city;
        }
        if (changeddata.post_code === '') {
            changeddata.post_code = this.state.data.post_code;
        }

        const serviceProviderId = authService.token?.entityId;
        authService.fetchAuthenticated(`${backendHost}/rest/updateServiceProvider/${serviceProviderId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changeddata)
        }).then(response => {
            if (!response.ok) {
                throw response;
            }
            return response;
        })
            .then(() => console.log("Salon changed successfully"))
            .then(() => this.fetchSalon().then(this.processSalon(), this.handleError()))
            // .then(this.clearData());
    }

    render() {
        return (
            <div className={'baseprofile'}>
                {this.addNamePhoto()}
                {this.addAddress()}
            </div>
        );
    }
}

export default Profile;
