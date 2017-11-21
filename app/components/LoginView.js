import React from "react";
import LoginHandler from "./LoginHandler.js";
import LoginForm from "./LoginForm.js";

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
        var name = input["name"];
        var pwd = input["pwd"];
        var authResult = this.state.handle(input);
        if (authResult ) {
            this.props.login(authResult);
        } else {
            //handleError
        }
    }


    render() {
        //logoViewHandler
        return (
            <LoginForm onSubmit={this.handleInput} />
        );

    }
}
