import React from "react";
import LoginView from "./LoginView.js";
import Menu from "./Menu.js";

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.changeToMenu = this.changeToMenu.bind(this);
        this.state = {
            content: <LoginView login={this.changeToMenu} />
        }
        // this.setState = this.setState.bind(this);
    }

    changeToMenu() {
        this.setState({content: <Menu />});
    }

    render() {
        return (
            this.state.content
        );
    }
}

// module.exports = App;
