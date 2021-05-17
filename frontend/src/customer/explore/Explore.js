import React, {Component} from 'react';
import "../../stylesheets/Customer.scss";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Explore extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            serviceProviders: [],
            selectedServiceProviders: [],
            favourites: [],
            favIds: [],
            selectedCity: null,
            selectedProviderName: null,
            isLoaded: false,
            error: null,
        };
        this.handleCitySelect = this.handleCitySelect.bind(this);
        this.handleProviderName = this.handleProviderName.bind(this);
        this.renderProviders = this.renderProviders.bind(this);
    }

    componentDidMount() {
        this.fetchServiceProviders().then(this.processServiceProviders(), this.handleError());
        this.fetchFavourites().then(this.processFavourites(), this.handleError());
    }

    getFavIds() {
        this.state.favIds = this.state.favourites.map((provider) =>
            provider.id
        );
    }

    fetchFavourites() {
        const customerId = authService.token?.entityId;
        return authService.fetchAuthenticated(`${backendHost}/rest/customers/${customerId}/favourites`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(response => response._embedded.serviceProviders);
    }

    fetchServiceProviders() {
        if(this.state.selectedCity!=null && this.state.selectedProviderName!=null) {
            return authService.fetchAuthenticated(`${backendHost}/rest/serviceProvidersViews/search/findByCityAndServiceProviderNameContainsIgnoreCase?city=${this.state.serviceProviders[this.state.selectedCity].city}&serviceProviderName=${this.state.selectedProviderName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch");
                    }
                    return response.json();
                })
                .then(response => response._embedded.serviceProvidersViews);
        }
        else if (this.state.selectedCity===null && this.state.selectedProviderName!=null) {
            return authService.fetchAuthenticated(`${backendHost}/rest/serviceProvidersViews/search/findByServiceProviderNameContainsIgnoreCase?serviceProviderName=${this.state.selectedProviderName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch");
                    }
                    return response.json();
                })
                .then(response => response._embedded.serviceProvidersViews);
        }
        else if (this.state.selectedCity!=null && this.state.selectedProviderName===null) {
            return authService.fetchAuthenticated(`${backendHost}/rest/serviceProvidersViews/search/findByCity?city=${this.state.serviceProviders[this.state.selectedCity].city}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch");
                    }
                    return response.json();
                })
                .then(response => response._embedded.serviceProvidersViews);
        }
        else{
            return authService.fetchAuthenticated(`${backendHost}/rest/serviceProvidersViews`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch");
                    }
                    return response.json();
                })
                .then(response => response._embedded.serviceProvidersViews);
        }
    }

    processServiceProviders() {
        return serviceProviders => {
            this.setState({
                isLoaded: true,
                serviceProviders: serviceProviders,
                selectedServiceProviders: serviceProviders
            });
        };
    }

    processSelectedServiceProviders() {
        return serviceProviders => {
            this.setState({
                isLoaded: true,
                selectedServiceProviders: serviceProviders
            });
        };
    }

    processFavourites() {
        return favourites => {
            this.setState({
                isLoaded: true,
                favourites: favourites
            });
        };
    }

    handleError() {
        return error => {
            this.setState({
                isLoaded: true,
                error: error
            })
            console.log("Error occurred: ", error);
        }
    }

    citiesSelect(){
        return this.state.serviceProviders.map((cities, index) => <option value={index}>{cities.city}</option>);
    }

    handleCitySelect(event){
        if(event.target.value==="Select city"){
            this.state.selectedCity = null;
            }
        else {
            this.state.selectedCity = event.target.value;
        }
        this.fetchServiceProviders().then(this.processSelectedServiceProviders(), this.handleError());
    }

    handleProviderName(event){
        if(event.target.value===""){
            this.state.selectedProviderName = null;
        }
        else {
            this.state.selectedProviderName = event.target.value;
        }
        this.fetchServiceProviders().then(this.processSelectedServiceProviders(), this.handleError());
    }

    renderProviders(){
        this.getFavIds();
        const urlPrefix = "http://localhost:3000/booking/";
        return this.state.selectedServiceProviders.map((providers) =>
            <div className="col-lg-4">
                <div className="card" style={{background: "#FDC2C6", marginTop: "5%"}}  >
                    <img className="card-img-top" style={{aspectRatio: "16/9"}} src={providers.imageUrl} alt="Card cap"/>
                    <div className="card-img-overlay">
                        <div className="row">
                            <div className="card"style={{width: "20%", background: "rgba(255,255,255,0.7)"}}>
                                <h2>{providers.averageGrade.toFixed(1)}</h2>
                            </div>
                            <div className="card"style={{width: "60%", background: "transparent"}}>
                            </div>
                            <div className="card"style={{width: "20%", background: "transparent"}}>
                                {this.state.favIds.includes(providers.id)
                                    ? <h2><i className="bi bi-star-fill"  style={{color: "red"}}> </i></h2>
                                    : <h2><i className="bi bi-star-fill"  style={{color: "white"}}> </i></h2>}
                            </div>
                        </div>
                    </div>
                    <a href={urlPrefix + providers.id} className="btn-lg btn-#fc848b stretched-link" style={{textDecoration: "none", color: "#000000"}}>{providers.serviceProviderName}</a>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <div className="input-group" style={{marginTop: "5%"}}>
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-search"  style={{color: "black"}}> </i></span>
                            <input type="text" className="form-control" placeholder="Service provider name" aria-label="Search" onChange={this.handleProviderName}
                                   aria-describedby="basic-addon1"/>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="input-group" style={{marginTop: "5%"}}>
                            <label className="input-group-text" htmlFor="inputGroupSelect01">City</label>
                            <select className="form-select" id="inputGroupSelect01" onChange={this.handleCitySelect} style={{width: "90%"}}>
                                <option selected>Select city</option>
                                {this.citiesSelect()}
                        </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.renderProviders()}
                </div>
            </div>
        );
    }
}

export default Explore;