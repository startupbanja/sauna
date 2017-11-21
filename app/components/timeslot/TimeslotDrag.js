import React, { Component } from 'react';
import { TimeslotDragable } from "./TimeslotDragable";

export const splitHeight = 50;

export class TimeslotDrag extends Component {
    constructor(props) {
        super(props);
        this.handleAvailableChange = this.handleAvailableChange.bind(this);
        this.handleBreakChange = this.handleBreakChange.bind(this);
    }
    
    handleAvailableChange(to, change) {
        this.props.onChange("available", to, change);
    }
    handleBreakChange(to, change, index) {
        this.props.onChange("break", to, change, index);
    }

    render() {
        const containerStyle = {
            position: 'relative',
            height: (this.props.end - this.props.start) / this.props.split * splitHeight
        };
        return (
            <div className="dragContainer" style={containerStyle}> 
                <TimeslotDragable start={this.props.start} end={this.props.end} split={this.props.split} startingSplit="0" type="break" dragable="false" />
                <TimeslotDragable   start={this.props.available.start} 
                                    end={this.props.available.end} 
                                    split={this.props.split} 
                                    startingSplit={(this.props.available.start - this.props.start) / this.props.split} 
                                    onChange={this.handleAvailableChange}
                                    type="available" dragable="true" />
                {this.props.breaks.map((b, index) => (<TimeslotDragable key={"dragBreak" + index}
                                                                        start={b.start}
                                                                        end={b.end}
                                                                        split={this.props.split}
                                                                        startingSplit={(b.start - this.props.start) / this.props.split}
                                                                        onChange={function(to, change) {this.handleBreakChange(to, change, index)}.bind(this)}
                                                                        type="break" dragable="true" />))}
            </div>
        );
    }
}
