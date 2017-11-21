import React from "react";
import Menu from "./Menu.js";
import Image from "./Image.js";
import pageContent from "./pageContent.js";


//This is the class that shows the whole page content after login
//Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.changeContent = this.changeContent.bind(this);
        this.state = {
            "current" : <div><h1>Welcome, {this.props.user}</h1><Image src="../app/imgs/firstScreen1.png"/></div>,
            contentMap: pageContent.contentMap,
            labels: pageContent.labels
        }
    }


    changeContent(key) {
        const view = this.state.contentMap[key];
        this.setState({current: view});
    }

    render() {
        return (
            <div>
            <Menu onChange={this.changeContent} logoff={this.props.logoff} content={this.state.labels} />
            {this.state.current}
            </div>
        );
    }
}
