import React, { Component } from 'react';
import { TimeslotDragable } from "./TimeslotDragable";

export const splitHeight = 50;

export class TimeslotDrag extends Component {
    render() {
        const containerStyle = {
            position: 'relative',
            height: (this.props.end - this.props.start) / this.props.split * splitHeight
        };
        var breaks = [];
        for (var i = 0; i < this.props.breaks.length; i++) {
            var b = this.props.breaks[i];
            breaks.push(<TimeslotDragable   key={"dragBreak" + i}
                                            start={b.start}
                                            end={b.end}
                                            split={this.props.split}
                                            startingSplit={(b.start - this.props.start) / this.props.split}
                                            type="break" dragable="true" />);
        }
        return (
            <div className="dragContainer" style={containerStyle}> 
                <TimeslotDragable start={this.props.start} end={this.props.end} split={this.props.split} startingSplit="0" type="break" dragable="false" />
                <TimeslotDragable   start={this.props.available.start} 
                                    end={this.props.available.end} 
                                    split={this.props.split} 
                                    startingSplit={(this.props.available.start - this.props.start) / this.props.split} 
                                    onChange={this.props.onChange}
                                    type="available" dragable="true" />
                {breaks}
            </div>
        );
    }
}
