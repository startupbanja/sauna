import React from "react";
import LoginHandler from "./LoginHandler.js";
import Button from "./Button.js";

export default class LoginView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            handle: LoginHandler
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
            <Button onClick={this.handleInput} text={"Click me!"} />
        );

    }
}
