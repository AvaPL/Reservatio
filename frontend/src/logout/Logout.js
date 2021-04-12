import React, {Component} from 'react';
import {Spinner} from "react-bootstrap";
import styles from './Logout.module.scss'
import {authService} from "../auth/AuthService";

class Logout extends Component {
    render() {
        return (
            <Spinner className={styles.spinner} animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }

    componentDidMount() {
        authService.logout()
        this.props.onLogout()
    }
}

export default Logout;