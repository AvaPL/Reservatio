import React, {Component} from 'react';

import './Statistics.scss'

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