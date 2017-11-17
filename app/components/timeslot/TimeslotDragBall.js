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
    }
    
    render() {
        if (this.props.position == "bottom") {
            return <div style={Object.assign({bottom: -splitHeight * 0.1}, styles.dragBall)}></div>;
        } else if (this.props.position == "top") {
            return <div style={Object.assign({top: -splitHeight * 0.1}, styles.dragBall)}></div>;
        }
    }
}