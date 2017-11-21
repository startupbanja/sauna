import React from "react";
import Button from "./Button.js";

export default class Menu extends React.Component {

    render() {
        return (
            <div>
            <Button
            onClick={() => {this.props.onChange("Timetable");}}
            text={"Timetable"} />
            <Button
            onClick={() => {this.props.onChange("Other Stuff");}}
            text={"Other stuff"} />
            <Button
            onClick={this.props.logoff}
            text={"Log Off"} />
            </div>
        );
    }
}
