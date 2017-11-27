import React from "react";
import LoginView from "./LoginView.js";
import MainView from "./MainView.js";

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.changeToMenu = this.changeToMenu.bind(this);
        this.changeToLogin = this.changeToLogin.bind(this);
        this.state = {
            //Shows either LoginView or MainView
            content: <LoginView login={this.changeToMenu} />
        }
        // this.setState = this.setState.bind(this);
    }

    changeToMenu(userName) {
        this.setState({content: <MainView user={userName} logoff={this.changeToLogin} />});
    }

    changeToLogin() {
        this.setState({content: <LoginView login={this.changeToMenu} />});
    }

    render() {
        return (
            this.state.content
        );
    }
}
