import React, { Component } from 'react';
import { TimeslotDragable } from "./TimeslotDragable";

export const totalHeight = 400;

export class TimeslotDrag extends Component {
    constructor(props) {
        super(props);
        this.handleAvailableChange = this.handleAvailableChange.bind(this);
    }
    
    handleAvailableChange(to, change) {
        this.props.onChange(to, change / totalHeight * (this.props.end - this.props.start));
    }

    render() {
        const containerStyle = {
            position: 'relative',
            height: totalHeight
        };
        return (
            <div className="dragContainer" style={containerStyle}> 
                <TimeslotDragable start={this.props.start} end={this.props.end} split={this.props.split} starting="0" ending={totalHeight} type="break" dragable="false" />
                <TimeslotDragable   start={this.props.available.start} 
                                    end={this.props.available.end} 
                                    starting={(this.props.available.start - this.props.start) * totalHeight / (this.props.end - this.props.start)} 
                                    ending={(this.props.available.end - this.props.start) * totalHeight / (this.props.end - this.props.start)}
                                    onChange={this.handleAvailableChange}
                                    type="available" dragable="true" />
            </div>
        );
    }
}
