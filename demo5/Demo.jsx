import React from 'react';
import {Spring} from '../../src/Spring';
import range from 'lodash.range';

const gridWidth = 150;
const gridHeight = 150;
const grid = range(4).map(() => range(6));

const Demo = React.createClass({
  getInitialState() {
    return {
      delta: [0, 0],
      mouse: [0, 0],
      isPressed: false,
      firstConfig: [60, 5],
      slider: {dragged: null, num: 0},
      lastPressed: [0, 0],
    };
  },

  handleMouseDown(pos, [pressX, pressY], {pageX, pageY, touches}) {
    const touchOrMousePageX = touches ? touches[0].pageX : pageX;
    const touchOrMousePageY = touches ? touches[0].pageY : pageY;

    this.setState({
      delta: [touchOrMousePageX - pressX, touchOrMousePageY - pressY],
      mouse: [pressX, pressY],
      isPressed: true,
      lastPressed: pos,
    });
  },

  handleMouseMove(e) {
    const touchOrMousePageX = e.touches ? e.touches[0].pageX : e.pageX;
    const touchOrMousePageY = e.touches ? e.touches[0].pageY : e.pageY;

    const {isPressed, delta: [dx, dy]} = this.state;
    if (isPressed) {
      this.setState({mouse: [touchOrMousePageX - dx, touchOrMousePageY - dy]});
    }
  },

  handleMouseUp(e) {
    this.setState({
      isPressed: false,
      delta: [0, 0],
      slider: {dragged: null, num: 0},
    });
    e.stopPropagation();
  },

  //

  handleChange(constant, num, {target}) {
    const {firstConfig: [s, d]} = this.state;
    if (constant === 'stiffness') {
      this.setState({
        firstConfig: [target.value - num * 30, d],
      });
    } else {
      this.setState({
        firstConfig: [s, target.value - num * 2],
      });
    }
  },

  handleMouseDownInput(constant, num) {
    this.setState({
      slider: {dragged: constant, num: num},
    });
  },

  render() {
    const {
      mouse, isPressed, lastPressed, firstConfig: [s0, d0], slider: {dragged, num},
    } = this.state;

    return (
      <div onMouseMove={this.handleMouseMove} onTouchMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onTouchEnd={this.handleMouseUp} className="demo5">
        {
          grid.map((row, i) => {
            return row.map((cell, j) => {
              const style = {
                top: gridHeight * i,
                left: gridWidth * j,
                width: gridWidth,
                height: gridHeight,
              };
              const stiffness = s0 + i * 30;
              const damping = d0 + j * 2;
              return (
                <div style={style} className="demo5-cell">
                  <input
                    type="range"
                    min={0}
                    max={300}
                    value={stiffness}
                    onMouseDown={this.handleMouseDownInput.bind(null, 'stiffness', i)}
                    onTouchStart={this.handleMouseDownInput.bind(null, 'stiffness', i)}
                    onChange={this.handleChange.bind(null, 'stiffness', i)} />
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={damping}
                    onMouseDown={this.handleMouseDownInput.bind(null, 'damping', j)}
                    onTouchStart={this.handleMouseDownInput.bind(null, 'damping', j)}
                    onChange={this.handleChange.bind(null, 'damping', j)} />
                  <Spring endValue={() => {
                    if (isPressed) {
                      return {val: mouse, config: []};
                    }
                    return {
                      val: [gridWidth / 2 - 25, gridHeight / 2 - 25],
                      config: [stiffness, damping],
                    };
                  }}>
                    {({val: [x, y]}) => {
                      let thing;
                      if (dragged === 'stiffness') {
                        thing = i < num ? <div className="demo5-minus">-{(num - i) * 30}</div>
                          : i > num ? <div className="demo5-plus">+{(i - num) * 30}</div>
                          : <div className="demo5-plus">0</div>;
                      } else {
                        thing = j < num ? <div className="demo5-minus">-{(num - j) * 2}</div>
                          : j > num ? <div className="demo5-plus">+{(j - num) * 2}</div>
                          : <div className="demo5-plus">0</div>;
                      }
                      const active = lastPressed[0] === i && lastPressed[1] === j
                        ? 'demo5-ball-active'
                        : '';
                      return (
                        <div
                          style={{
                            transform: `translate3d(${x}px, ${y}px, 0)`,
                            WebkitTransform: `translate3d(${x}px, ${y}px, 0)`,
                          }}
                          className={'demo5-ball ' + active}
                          onTouchStart={this.handleMouseDown.bind(null, [i, j], [x, y])}
                          onMouseDown={this.handleMouseDown.bind(null, [i, j], [x, y])}>
                          <div className="demo5-constants">
                            {stiffness}{dragged === 'stiffness' && thing}
                          </div>
                          <div className="demo5-constants">
                            {damping}{dragged === 'damping' && thing}
                          </div>
                        </div>
                      );
                    }}
                  </Spring>
                </div>
              );
            });
          })
        }
      </div>
    );
  },
});


export default Demo;
