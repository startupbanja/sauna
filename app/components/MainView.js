import React from "react";
import Menu from "./Menu.js";
import Image from "./Image.js";


//This is the class that shows the whole page content after login
//Currently shows a menubar at the top and content below it
export default class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.changeContent = this.changeContent.bind(this);
        this.state = {
            "current" : <div><h1>Welcome, {this.props.user}</h1><Image src="../app/imgs/firstScreen1.png"/></div>,
            contentMap: {
                "mainPage" : <div><h1>Home</h1><Image src="../app/imgs/firstScreen1.png"/></div>,
                "timetable" : <div><h1>Timetable</h1><Image src="../app/imgs/userSchedule1.png"/></div>,
                "userProfile" : <div><h1>User Profile</h1><Image src="../app/imgs/userProfile1.png"/></div>,
                "feedback" : <div><h1>Feedback Forms</h1><Image src="../app/imgs/feedback2.png"/></div>,
                "coaches" : <div><h1>Coach Information</h1><Image src="../app/imgs/coaches1.png"/></div>,
            },
            labels: {
                "mainPage" : "Home",
                "timetable" : "Timetable",
                "userProfile" : "User Profile",
                "feedback" : "Feedback",
                "coaches" : "Coaches"
            }
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
