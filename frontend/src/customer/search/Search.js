import React, {Component} from 'react';
import "../../stylesheets/Customer.scss";

class Search extends Component {

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
        ]
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <div className="input-group" style={{marginTop: "5%"}}>
                            <span className="input-group-text" id="basic-addon1"><i className="bi bi-search"
                                                                                    style={{color: "white"}}> </i></span>
                            <input type="text" className="form-control" placeholder="Name of the salon"
                                   aria-label="Search"
                                   aria-describedby="basic-addon1"/>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="input-group" style={{marginTop: "5%"}}>
                            <label className="input-group-text" htmlFor="inputGroupSelect01">City</label>
                            <select className="form-select" id="inputGroupSelect01" style={{width: "90%"}}>
                                <option selected>Choose</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card" style={{background: "#FDC2C6", marginTop: "5%"}}>
                            <img className="card-img-top" style={{aspectRatio: "16/9"}}
                                 src="https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg" alt="Card cap"/>
                            <div className="card-img-overlay">
                                <div className="row">
                                    <div className="card" style={{width: "20%", background: "rgba(255,255,255,0.7)"}}>
                                        <h2>5.0</h2>
                                    </div>
                                    <div className="card" style={{width: "60%", background: "transparent"}}>
                                    </div>
                                    <div className="card" style={{width: "20%", background: "transparent"}}>
                                        <h2><i className="bi bi-star-fill" style={{color: "white"}}> </i></h2>
                                    </div>
                                </div>
                            </div>
                            <a href="http://localhost:3000/customer/booking/1"
                               className="btn-lg btn-#fc848b stretched-link"
                               style={{textDecoration: "none", color: "#000000"}}>uBasi</a>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card" style={{background: "#FDC2C6", marginTop: "5%"}}>
                            <img className="card-img-top" style={{aspectRatio: "16/9"}}
                                 src="https://welpmagazine.com/wp-content/uploads/2020/10/Filament-hair-salon1.jpg"
                                 alt="Card cap"/>
                            <div className="card-img-overlay">
                                <div className="row">
                                    <div className="card" style={{width: "20%", background: "rgba(255,255,255,0.7)"}}>
                                        <h2>5.0</h2>
                                    </div>
                                    <div className="card" style={{width: "60%", background: "transparent"}}>
                                    </div>
                                    <div className="card" style={{width: "20%", background: "transparent"}}>
                                        <h2><i className="bi bi-star-fill" style={{color: "white"}}> </i></h2>
                                    </div>
                                </div>
                            </div>
                            <a href="http://localhost:3000/customer/booking/1"
                               className="btn-lg btn-#fc848b stretched-link"
                               style={{textDecoration: "none", color: "#000000"}}>Salon1</a>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card" style={{background: "#FDC2C6", marginTop: "5%"}}>
                            <img className="card-img-top" style={{aspectRatio: "16/9"}}
                                 src="https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg" alt="Card cap"/>
                            <div className="card-img-overlay">
                                <div className="row">
                                    <div className="card" style={{width: "20%", background: "rgba(255,255,255,0.7)"}}>
                                        <h2>5.0</h2>
                                    </div>
                                    <div className="card" style={{width: "60%", background: "transparent"}}>
                                    </div>
                                    <div className="card" style={{width: "20%", background: "transparent"}}>
                                        <h2><i className="bi bi-star-fill" style={{color: "white"}}> </i></h2>
                                    </div>
                                </div>
                            </div>
                            <a href="http://localhost:3000/customer/booking/1"
                               className="btn-lg btn-#fc848b stretched-link"
                               style={{textDecoration: "none", color: "#000000"}}>Salon2</a>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card" style={{background: "#FDC2C6", marginTop: "5%"}}>
                            <img className="card-img-top" style={{aspectRatio: "16/9"}}
                                 src="https://www.triss.com.pl/wp-content/uploads/granat-2768U-1.jpg" alt="Card cap"/>
                            <div className="card-img-overlay">
                                <div className="row">
                                    <div className="card" style={{width: "20%", background: "rgba(255,255,255,0.7)"}}>
                                        <h2>5.0</h2>
                                    </div>
                                    <div className="card" style={{width: "60%", background: "transparent"}}>
                                    </div>
                                    <div className="card" style={{width: "20%", background: "transparent"}}>
                                        <h2><i className="bi bi-star-fill" style={{color: "white"}}> </i></h2>
                                    </div>
                                </div>
                            </div>
                            <a href="http://localhost:3000/customer/booking/1"
                               className="btn-lg btn-#fc848b stretched-link"
                               style={{textDecoration: "none", color: "#000000"}}>Salon3</a>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card" style={{background: "#FDC2C6", marginTop: "5%"}}>
                            <img className="card-img-top" style={{aspectRatio: "16/9"}}
                                 src="https://pliki.propertydesign.pl/i/11/75/94/117594_r0_1140.jpg" alt="Card cap"/>
                            <div className="card-img-overlay">
                                <div className="row">
                                    <div className="card" style={{width: "20%", background: "rgba(255,255,255,0.7)"}}>
                                        <h2>5.0</h2>
                                    </div>
                                    <div className="card" style={{width: "60%", background: "transparent"}}>
                                    </div>
                                    <div className="card" style={{width: "20%", background: "transparent"}}>
                                        <h2><i className="bi bi-star-fill" style={{color: "white"}}> </i></h2>
                                    </div>
                                </div>
                            </div>
                            <a href="http://localhost:3000/customer/booking/1"
                               className="btn-lg btn-#fc848b stretched-link"
                               style={{textDecoration: "none", color: "#000000"}}>Salon4</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;