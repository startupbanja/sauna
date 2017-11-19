import React from "react";


export default class TextField extends React.Component {
    render() {
        return (
            <input onChange={this.props.onChange} value={this.props.value} />
        );
    }
}
