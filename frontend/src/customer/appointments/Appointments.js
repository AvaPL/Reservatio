import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {Modal, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";


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

    componentDidMount(){
        fetch("http://localhost:8080/rest/customerReservationViews/5/reservations")
            .then(res => res.json()).then(res => res._embedded.reservationViews)
            .then(reservations => {this.setState({dataP:reservations});});
        //for(var i=0;i<this.state.dataP.length;i++){
            console.log(this.state.dataP);
        //}
    }

    showPast(){
        this.setState({navigation: "past"});
    }

    showUpcoming(){
        this.setState({navigation: "upcoming"});
    }

    render() {
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

    show(){
        this.setState({open: true});
    }

    hide(){
        this.setState({open: false})
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
                                {item.serviceName}
                            </div>
                            <div className="col"></div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col top ">
                                {item.dateTime}
                            </div>
                            <div className="col">
                                <Button variant="danger" onClick={()=>this.show()}>
                                    Add review
                                </Button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col">
                                {item.providerName}
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
                <div className="break"></div>

                <Modal show={this.state.open} onHide={()=>this.hide()}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       centered
                       className="mod"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                                <ToggleButtonGroup className="mod" type="radio"  name="options" defaultValue={1}>
                                    <ToggleButton variant="danger" value={1}>1</ToggleButton>
                                    <ToggleButton variant="danger" value={2}>2</ToggleButton>
                                    <ToggleButton variant="danger" value={3}>3</ToggleButton>
                                    <ToggleButton variant="danger" value={4}>4</ToggleButton>
                                    <ToggleButton variant="danger" value={5}>5</ToggleButton>
                                </ToggleButtonGroup>
                            </Form.Label>
                            <Form.Control as="textarea" rows={10} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.hide()}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={()=>this.hide()}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
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