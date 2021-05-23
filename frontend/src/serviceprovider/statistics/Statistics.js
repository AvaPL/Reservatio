import React, {Component} from 'react';

import './Statistics.scss'
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // numberServices: 0,
            // numberVisits: 0,
            // averageRate: 0,
            // numberLikes: 0
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
                //console.log(number)
                this.setState({numberLikes:number})
            })

        authService.fetchAuthenticated(`${backendHost}/rest/bookingViews/${providerId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then(res => res.reviews)
            .then(reviews =>{
                //console.log(reviews)
                var counter = 0;
                var sumGrade = 0;
                for(let i = 0; i< reviews.length; i++){
                    counter = counter + reviews[i].reservations.length
                    for(let j = 0; j< reviews[i].reservations.length;j++){
                        sumGrade = sumGrade + reviews[i].reservations[j].grade;
                    }
                }
                if(counter==0)
                    this.setState({averageRate: 0})
                else
                    this.setState({averageRate: sumGrade/counter})
                this.setState({numberServices: counter})
            })



    }

    render() {
        return (
            <>
                <div className="break"></div>
                <div className="row justify-content-center break">
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

            </>
        )
    }
}

export default Statistics;
