import React, {Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {Modal, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

import './Appointments.scss'

class Appointments extends Component {

    constructor(props) {
        super(props);
        this.showPast.bind(this);
        this.showUpcoming.bind(this);
        this.state = {
            data: [],
            dataU: []
        };
    }

    fetchData(){
        var array;
        var seconds;
        const customerId = authService.token?.entityId
        authService.fetchAuthenticated(`${backendHost}/rest/customerReservationViews/${customerId}/reservations`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(res => res._embedded.reservationViews)
            .then(reservations => {
                this.setState({data:reservations});
                for(let i=0;i<this.state.data.length;i++){
                    array = this.state.data[i].dateTime.substring(11,16).split(':')
                    seconds = (+array[0]) * 60 * 60 + (+array[1]) * 60  + this.state.data[i].duration * 60
                    let data = [...this.state.data]
                    let d = {...data[i]}
                    d.end = this.sec2time(seconds)
                    data[i]=d
                    this.setState({data})

                    let test = this.state.data[i]._links.self.href.substring(this.state.data[i]._links.self.href.lastIndexOf("/")+1,this.state.data[i]._links.self.href.length)
                    data = [...this.state.data]
                    let t = {...data[i]}
                    t.ID = test
                    data[i]=t
                    this.setState({data})

                    if(Date.now() < Date.parse(this.state.data[i].dateTime)){
                        let joined = this.state.dataU.concat(this.state.data.splice(i,1))
                        this.setState({dataU: joined})
                        i--
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    componentDidMount(){
        this.fetchData();
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

                <Modal show={this.state.open} onHide={()=>this.hideReview()}
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
                                <ToggleButtonGroup className="mod" type="radio"  name="options" defaultValue={1} onChange={(value) =>this.setState({reviewStar: value})}>
                                    <ToggleButton variant="danger" value={1}>1</ToggleButton>
                                    <ToggleButton variant="danger" value={2}>2</ToggleButton>
                                    <ToggleButton variant="danger" value={3}>3</ToggleButton>
                                    <ToggleButton variant="danger" value={4}>4</ToggleButton>
                                    <ToggleButton variant="danger" value={5}>5</ToggleButton>
                                </ToggleButtonGroup>
                            </Form.Label>
                            <Form.Control as="textarea"  rows={10}
                                          onChange={(event) =>this.setState({reviewMessage: event.target.value})}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={()=>{
                                this.hideReview();
                                this.setState({reviewMessage: ""});
                                this.setState({reviewStar: ""});
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="danger"
                            onClick={()=>{
                                this.hideReview();
                                console.log(`${backendHost}/rest/addReview/${this.state.clickedReservation}`);
                                authService.fetchAuthenticated(`${backendHost}/rest/addReview/${this.state.clickedReservation}`,{
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({grade: this.state.reviewStar, message: this.state.reviewMessage})
                                }).then(response => {
                                    if (!response.ok) {
                                        throw new Error("Failed to post");
                                    }
                                    return response;
                                })
                                //TODO delete reload
                                window.location.reload(false);
                                this.setState({reviewMessage: ""});
                                this.setState({reviewStar: ""});
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    showReview(){
        this.setState({open: true});
    }

    hideReview(){
        this.setState({open: false});
    }

    renderPast() {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        let tmp = this.state.data.sort((a,b)=>Date.parse(b.dateTime)-Date.parse(a.dateTime)).map((item, index) => (
            <>
                <div className="rcorners2 justify-content-center" key={index}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col top">
                                <div className="calendar row">
                                    <div className="calendarleft"></div>
                                    <div className="jumpleft">
                                        <div className="row">
                                            {monthNames[parseInt(item.dateTime.substring(5,7))-1]}
                                        </div>
                                        <div className="row day">
                                            {item.dateTime.substring(8,10)}
                                        </div>
                                        <div className="row">
                                            {item.dateTime.substring(0,4)}
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
                                {item.dateTime.substring(11,16).concat('-',item.end)}
                            </div>
                            <div className="col">
                                <Button variant="danger" onClick={()=>{this.setState({clickedReservation: item.ID});this.showReview()}} disabled={item.reviewId}>
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

            </>
        ));
        return tmp;
    }

    renderUpcoming() {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        return this.state.dataU.sort((a,b)=>Date.parse(a.dateTime)-Date.parse(b.dateTime)).map((item, index) => (
            <>
                <div className="rcorners2 justify-content-center" key={item.ID}>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col top">
                                <div className="calendar row">
                                    <div className="calendarleft"></div>
                                    <div className="jumpleft">
                                        <div className="row">
                                            {monthNames[parseInt(item.dateTime.substring(5,7))-1]}
                                        </div>
                                        <div className="row day">
                                            {item.dateTime.substring(8,10)}
                                        </div>
                                        <div className="row">
                                            {item.dateTime.substring(0,4)}
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
                                {item.dateTime.substring(11,16).concat('-',item.end)}
                            </div>
                            <div className="col">
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col top">
                                {item.providerName}
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </div>
                <div className="break"></div>
            </>
        ));
    }


    sec2time(timeInSeconds) {
        var pad = function(num, size) { return ('000' + num).slice(size * -1); },
            time = parseFloat(timeInSeconds).toFixed(3),
            hours = Math.floor(time / 60 / 60),
            minutes = Math.floor(time / 60) % 60;
        return pad(hours, 2) + ':' + pad(minutes, 2);
    }
}

export default Appointments;
