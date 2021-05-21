import React, {Component} from 'react';
import './Profile.scss';
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";
import {Button, Modal} from "react-bootstrap";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            city : '',
            post_code : '',
            street : '',
            property_nr : '',
            phone_nr : '',
            email : '',
            src : `http://localhost:9000/reservatio/serviceprovider${authService.token?.entityId}.jpg?=` + new Date().getTime(),
            alt: "photo",
            error: null,
            data: {},
            file : null,
            showModalChange : false
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
                data: data
            });
            console.log(data);
        };
    }

    handleError() {
        return error => {
            this.setState({
                error: error
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
                    <Button className="employees-button-secondary shadow-none"
                            onClick={() => this.setState({showModalChange: false})}>Cancel</Button>
                    <Button className="employees-button-primary shadow-none" onClick={() => this.onChangeClicked()} >Change</Button>
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

            const serviceProviderId = authService.token?.entityId;
            authService.fetchAuthenticated(`${backendHost}/rest/uploadImage/${serviceProviderId}`, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response;
                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            this.setState({
                showModalChange: false,
                src : `http://localhost:9000/reservatio/serviceprovider${authService.token?.entityId}.jpg?${global.Date.now()}`,
                file: null});
            // window.location.reload();
        }
    }

    addNamePhoto() {
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
    }

    addAddressData(name, id, placeholder, value){
        return(
            <div className={'salon-address-row'}>
                <div className={'salon-address-blank'}>

                </div>
                <div className={'salon-address-row-text'}>
                    {name}:
                </div>
                <input className={'salon-address-input'}
                       id = {id}
                       type='text'
                       placeholder={placeholder}
                       name = {value}
                       onChange={this.changeHandler}
                />
                <div className={'salon-address-blank'}>

                </div>
            </div>
        );
    }

    addAddress(){
        return(
            <div className={'salon-address'}>

                {this.addAddressData('Salon name','1',this.state.data.name, 'name')}
                {this.addAddressData('City','2',this.state.data.city, 'city')}
                {this.addAddressData('Post code','3',this.state.data.post_code, 'post_code')}
                {this.addAddressData('Street','4',this.state.data.street, 'street')}
                {this.addAddressData('Property number','5',this.state.data.property_nr, 'property_nr')}
                {this.addAddressData('Email','6',this.state.data.email, 'email')}
                {this.addAddressData('Phone number','7',this.state.data.phone_nr, 'phone_nr')}

                <div className={'salon-address-button-container'}>
                    <button className={'salon-address-button'} onClick={this.changeSalonProfile}> Change info </button>
                </div>
            </div>
        );
    }

    changeSalonProfile(){
        let changeddata = {
            name : '',
            phone_nr : '',
            email : '',
            street : '',
            property_nr : '',
            city : '',
            post_code : ''
        };
        if (this.state.name === '') {
            changeddata.name = this.state.data.name;
        }
        else {
            changeddata.name = this.state.name;
        }
        if (this.state.phone_nr === '') {
            changeddata.phone_nr = this.state.data.phone_nr;
        }
        else {
            changeddata.phone_nr = this.state.phone_nr;
        }
        if (this.state.email === '') {
            changeddata.email = this.state.data.email;
        }
        else {
            changeddata.email = this.state.email;
        }
        if (this.state.street === '') {
            changeddata.street = this.state.data.street;
        }
        else {
            changeddata.street = this.state.street;
        }
        if (this.state.property_nr === '') {
            changeddata.property_nr = this.state.data.property_nr;
        }
        else {
            changeddata.property_nr = this.state.property_nr;
        }
        if (this.state.city === '') {
            changeddata.city = this.state.data.city;
        }
        else {
            changeddata.city = this.state.city;
        }
        if (this.state.post_code === '') {
            changeddata.post_code = this.state.data.post_code;
        }
        else {
            changeddata.post_code = this.state.post_code;
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
            .then(this.clearData())
            .then(() => this.fetchSalon().then(this.processSalon(), this.handleError()));
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