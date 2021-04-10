import React, {Component} from 'react';
import './Profile.scss'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Name of salon",
            source: "https://www.swiatobrazu.pl/zdjecie/artykuly/550890/wiewiorka.png",
            alt: "photo",
            street: "Oławska 16",
            phone: "123456789",
            email: "abc@gmail.com",
            city: "Wrocław"
        };
    }

    addNamePhoto() {
        return (
            <div className={'salon-name-photo'}>
                <div className={'salon-name'}>
                    {this.state.name}
                </div>

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
                    <div className={'salon-address-row-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Street:
                    </div>
                    <div className={'salon-address-row-value'}>
                        <input className={'salon-address-input'} id="street" type="text" value={this.state.street}/>
                    </div>
                    <div className={'salon-address-row-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-row-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        Phone number:
                    </div>
                    <div className={'salon-address-row-value'}>
                        <input className={'salon-address-input'} id="phone" type="text" value={this.state.phone}/>
                    </div>

                    <div className={'salon-address-row-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-row-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        E-mail:
                    </div>
                    <div className={'salon-address-row-value'}>
                        <input className={'salon-address-input'} id="email" type="text" value={this.state.email}/>
                    </div>
                    <div className={'salon-address-row-blank'}>

                    </div>
                </div>

                <div className={'salon-address-row'}>
                    <div className={'salon-address-row-blank'}>

                    </div>
                    <div className={'salon-address-row-text'}>
                        City:
                    </div>
                    <div className={'salon-address-row-value'}>
                        <input className={'salon-address-input'} id="city" type="text" value={this.state.city}/>
                    </div>
                    <div className={'salon-address-row-blank'}>

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