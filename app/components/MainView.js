import React from "react";
import Menu from "./Menu.js";


//This is the class that shows the whoel page content after login
//Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.changeContent = this.changeContent.bind(this);
        this.state = {
            content:  <h1>Timetable</h1>//Just placeholder for an actual react component
        }
    }


    changeContent(newContent) {
        const view = <h1>{newContent}</h1>
        this.setState({content: view})
    }

    render() {
        return (
            <div>
            <Menu onChange={this.changeContent} logoff={this.props.logoff}/>
            {this.state.content}
            </div>
        );
    }
}
