import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import './Appointments.scss'

class Appointments extends Component {

    constructor(props) {
        super(props);
        this.showPast.bind(this);
        this.showUpcoming.bind(this);
        this.state = {
            //navigation: "past",
            dataP: [
                {
                    id:1,
                    time: "15.15 - 15.45",
                    service: "strzyżenie",
                    date: "19.03.2021",
                    serviceProvider: "uBasi"
                },
                {
                    id:2,
                    time: "14.15 - 15.00",
                    service: "strzyżenie",
                    date: "21.03.2021",
                    serviceProvider: "Barber"
                },
                {
                    id:3,
                    time: "11.15 - 12.00",
                    service: "makeup",
                    date: "23.03.2021",
                    serviceProvider: "Kasia MUA"
                }
            ]
        };
    }

    getData(){
        let customerId = 9;
        return fetch("http://localhost:8080/rest/customerReservationViews/5/reservations")
            .then(response => console.log(response));
        //"http://localhost:8080/rest/serviceProviderEmployeesViews/1/employees"
    }

    showPast(){
        this.setState({navigation: "past"});
    }

    showUpcoming(){
        this.setState({navigation: "upcoming"});
    }

    render() {
        console.log("test");
        const tab = this.state.navigation;
        let page;
        switch (tab){
            case "past":
                page = this.renderPast();
                break
            case "upcoming":
                page = this.renderUpcoming();
                break
            default:
                page = this.renderPast();
                break
        }
        return (
            <>
                &nbsp;
                <Nav
                    fill
                    defaultActiveKey="Past"
                    variant="tabs"
                    className="justify-content-center"
                >
                    <Nav.Link
                        className="test"
                        eventKey="Past"
                        action onClick={() => this.showPast()}
                    >
                        Past
                    </Nav.Link>
                    <Nav.Link
                        className="test"
                        eventKey="Upcoming"
                        action onClick={() => this.showUpcoming()}
                    >
                        Upcoming
                    </Nav.Link>
                </Nav>
                &nbsp;
                {page}
            </>
        );
    }

    renderPast() {
        return this.state.dataP.map((item, index) => (
            <>
                <div className="rcorners2 justify-content-center" key={index}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col top">
                                <div className="calendar row">
                                    <div className="calendarleft"></div>
                                    <div className="jumpleft">
                                        <div className="row">
                                            JUN
                                        </div>
                                        <div className="row day">
                                            25
                                        </div>
                                        <div className="row">
                                            2021
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                {item.service}
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col top ">
                                {item.time}
                            </div>
                            <div className="col">
                                <Button variant="danger">
                                    Add review
                                </Button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col">
                                {item.serviceProvider}
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
                <div className="break"></div>
            </>
        ));
    }

    renderUpcoming() {
        return this.state.dataP.map((item, index) => (
            <>
                <div className="rcorners2 justify-content-center" key={index}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col top">
                                <div className="calendar row">
                                    <div className="calendarleft"></div>
                                    <div className="jumpleft">
                                        <div className="row">
                                            JUN
                                        </div>
                                        <div className="row day">
                                            25
                                        </div>
                                        <div className="row">
                                            2021
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                {item.service}
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col top ">
                                {item.time}
                            </div>
                            <div className="col">
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col top">
                                {item.serviceProvider}
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
                <div className="break"></div>
            </>
        ));
    }
}

export default Appointments;