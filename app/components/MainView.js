import React from "react";
import Menu from "./Menu.js";


//This is the class that shows the whoel page content after login
//Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.changeContent = this.changeContent.bind(this);
        this.state = {
            "current" : <h1>Welcome, {this.props.user}</h1>,
            contentMap: {
                "timetable" : <h1>Timetable</h1>,
                "otherstuff": <h1>Other stuff</h1>
            },

            labels: {
                "timetable" : "Timetable",
                "otherstuff": "Other Stuff"
            }
        }
        var landingPage = "timetable";
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
