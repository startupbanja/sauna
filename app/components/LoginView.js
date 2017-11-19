import React from "react";
import LoginHandler from "./LoginHandler.js";
import Button from "./Button.js";

//This view contains all the login-related things and is shown as the default view
export default class LoginView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            handle: LoginHandler //This is currently just a function that returns true
        }
        this.handleInput = this.handleInput.bind(this);
    }


    handleInput(input) {
        var authResult = this.state.handle(input);
        if (authResult) {
            this.props.login();
        } else {
            //handleError
        }
    }


    render() {
        //logoViewHandler
        //salasana/tekstikenttä
        return (
            //TODO add some textbox and put together with Button in a separate form wrapper
            <Button onClick={this.handleInput} text={"Log In"} />
        );

    }
}
