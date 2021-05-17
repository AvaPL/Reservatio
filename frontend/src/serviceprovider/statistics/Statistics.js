import React, {Component} from 'react';

import './Statistics.scss'
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numberServices: 751,
            numberVisits: 4592,
            averageRate: 4.5,
            numberLikes: 311
        }
    }

    componentDidMount() {

        const providerId = authService.token?.entityId
        authService.fetchAuthenticated(`${backendHost}/rest/favouriteViews/${providerId}`)
            .then(response => {
                if (!response.ok) {
                    //throw new Error("Failed to fetch");
                    //console.clear();
                    return JSON.parse('{ "number":"0" }')
                }
                return response.json();
            })
            .then(res => res.number)
            .then(number =>{
                console.log(number)
                this.setState({numberLikes:number})
            })

        authService.fetchAuthenticated(`${backendHost}/rest/bookingViews/${1}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(res => res.reviews.length)
            .then(reviews =>{
                console.log(reviews)
                this.setState({numberServices: reviews})
            })



    }

    render() {
        return (
            <>
                <div className="break"></div>
                <div className="row justify-content-center">
                    <div className="circle">
                        <p className="textc">
                            {this.state.numberServices}
                        </p>
                    </div>
                    <div className="text left_">
                        Number of booked services
                    </div>
                </div>

                {/*<div className="row justify-content-center">*/}
                {/*    <div className="text left-two">*/}
                {/*        Number of profile visits*/}
                {/*    </div>*/}
                {/*    <div className="circle left_">*/}
                {/*        <p className="textc">*/}
                {/*            {this.state.numberVisits}*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}



                <div className="row justify-content-center break">
                    <div className="circle">
                        <p className="textc">
                            {this.state.numberLikes}
                        </p>
                    </div>
                    <div className="text left_ right_">
                        Number of likes
                    </div>
                </div>

                <div className="row justify-content-center break">
                    <div className="circle">
                        <p className="textc">
                            {this.state.averageRate}
                        </p>
                    </div>
                    <div className="text left_ right-five">
                        Average rate
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="text left-five">
                        Number of likes
                    </div>
                    <div className="circle left_">
                        <p className="textc">
                            {this.state.numberLikes}
                        </p>
                    </div>
                </div>

            </>
        )
    }
}

export default Statistics;