import React, {Component} from 'react';
import './Node.css';

export default class Node extends Component {
    render() {
        const {
          row,
          col,
          startNode,
          finishNode,
          isBlocked,
          onMouseDown,
          onMouseEnter,
          onMouseUp,
        } = this.props;
        
        const extraClassName = finishNode
          ? 'finish-node'
          : startNode
          ? 'start-node'
          : isBlocked
          ? 'blocked-node'
          : '';
    
        return (
          <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}></div>
        );
      }
    }