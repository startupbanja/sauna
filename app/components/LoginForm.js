import React from "react";
import Button from "./Button.js";
import TextField from "./TextField.js";


export default class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nameInput: ""
        }
        this.usernameChanged = this.usernameChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    usernameChanged(e) {
        this.setState({nameInput : e.target.value});
    }

    handleSubmit() {
        this.props.onSubmit(this.state.nameInput);
    }


    render() {
        return (
            <div>
            <TextField onChange={this.usernameChanged} value={this.state.nameInput} />
            <br/>
            <Button onClick={this.handleSubmit} text={"Log In"} />
            </div>
        );

    }
}
