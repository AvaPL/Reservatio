import React, {Component} from 'react';
import './Profile.scss'
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Name of salon",
            source: "https://ocdn.eu/pulscms-transforms/1/iW-k9kpTURBXy9mOTk1NzZhNTY3YjhlYjljZWQ3MDcxMGJjNWEzZTZhNy5qcGeTlQMAFs0C1M0Bl5MFzQMUzQG8kwmmNTk2MTk0BoGhMAE/gettyimages-954867550.jpg",
            alt: "photo",
            street: "Oławska 16",
            phone: "123456789",
            email: "abc@gmail.com",
            city: "Wrocław",

            error: null,
            data: {}
        };
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

    addNamePhoto() {
        return (
            <div className={'salon-name-photo'}>
                <div className="card bg-dark text-white">
                    <img className="card-img salon-photo" src={this.state.source} alt={this.state.alt}/>
                    <div className="card-img-overlay salon-photo-button-container">
                        <button className={'salon-photo-button'}> Change photo </button>
                    </div>
                </div>
            </div>
        );
    }

    addAddress(){
        return(
            <div className={'salon-address'}>
                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Salon name:
                    </div>
                    <input className={'salon-address-input'}
                        type='text'
                        placeholder={this.state.data.name}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        City:
                    </div>
                    <input className={'salon-address-input'}
                           type='text'
                           placeholder={this.state.data.city}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Post code:
                    </div>
                    <input className={'salon-address-input'}
                           type='text'
                           placeholder={this.state.data.post_code}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Street:
                    </div>
                    <input className={'salon-address-input'}
                           type='text'
                           placeholder={this.state.data.street}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Propoerty number:
                    </div>
                    <input className={'salon-address-input'}
                           type='text'
                           placeholder={this.state.data.property_nr}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Email:
                    </div>
                    <input className={'salon-address-input'}
                           type='text'
                           placeholder={this.state.data.email}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Phone number:
                    </div>
                    <input className={'salon-address-input'}
                           type='text'
                           placeholder={this.state.data.phone_nr}
                    />
                    <div className={'salon-address-blank'}>

                    </div>
                </div>

                <div className={'salon-address-button-container'}>
                    <button className={'salon-address-button'}> Change info </button>
                </div>
            </div>
        );
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