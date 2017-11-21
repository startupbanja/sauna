import React from "react";
import Button from "./Button.js";

export default class Menu extends React.Component {

    render() {
        var list = [];
        for (var name in this.props.content) {
            list.push(<li key={name}><Button onClick={() => {this.props.onChange(name);}}
            text={this.props.content[name]} /></li>)
        }
        return (
            <div>
            <ul>{list}</ul>
            <Button
            onClick={this.props.logoff}
            text={"Log Off"} />
            </div>
        );
    }
}
