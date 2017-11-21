import React from "react";


export default class TextField extends React.Component {
    render() {
        var id = "input_"+this.props.label
        return (
            <div>
                <label htmlFor={id}>{this.props.label}</label><br/>
                <input id={id} type={this.props.type} onChange={this.props.onChange} value={this.props.value} />
            </div>
        );
    }
}
