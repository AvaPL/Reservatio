import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import {authService} from "../../auth/AuthService";
import {backendHost} from "../../Config";

export class ChangePhotoModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            services: [],
            checkedServices: new Set(),
            error: null,
            isLoaded: false
        }
    }
    render(){

    };
}