import React, { Component } from 'react';
import {splitHeight} from './TimeslotDrag';

const styles = {
    dragBall: {
        borderRadius: '100%',
        background: 'black',
        position: 'absolute',
        left: '50%',
    }
};

export class TimeslotDragBall extends Component {
    constructor(props) {
        super(props);
        Object.assign(styles.dragBall, {width: splitHeight * 0.2});
        Object.assign(styles.dragBall, {height: splitHeight * 0.2});
        this.handleDrag = this.handleDrag.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
    }

    handleDrag(event) {
        if (event.clientY === 0) return;
        var origY = event.target.parentElement.offsetTop + (event.target.offsetTop + styles.dragBall.height / 2);
        var dragY = event.clientY - event.target.closest(".dragContainer").getBoundingClientRect().top;
        console.log(origY + " - " + dragY);
        this.props.onChange(dragY - origY);
    }

    handleTouchMove(event) {
        if (event.targetTouches.item(0).clientY === 0) return;
        var origY = event.target.parentElement.offsetTop + (event.target.offsetTop + styles.dragBall.height / 2);
        var dragY = event.targetTouches.item(0).clientY - event.target.closest(".dragContainer").getBoundingClientRect().top;
        this.props.onChange(dragY - origY);
    }

    render() {
        var position = {};
        if (this.props.position == "bottom") position = {bottom: -splitHeight * 0.1};
        else if (this.props.position == "top") position = {top: -splitHeight * 0.1};
        return (
            <div draggable="true" 
                    onDrag={this.handleDrag}
                    onTouchMove={this.handleTouchMove} 
                    style={Object.assign(position, styles.dragBall)}>
            </div>
        );    
    }
}