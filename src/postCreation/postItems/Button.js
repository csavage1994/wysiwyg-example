import React, { Component } from 'react';

import './styles/button.css';

export default class Button extends Component {
  componentDidMount = () => {
    if (this.props.focused) {
      this.input.focus();
    }
  }

  handleKeys = (e, field) => {
    const { item, update } = this.props;
    update({...item, [field]: e.target.value});
  }

  handleBlur = (e) => {
    const { update, item } = this.props;
    const { value } = e.target;

    if (value.indexOf('http') === 0) {
      return;
    }

    update({...item, Link: `https://${item.Link}`});
  }

  render() {
    const { focused, item } = this.props;
    
    return (
      <div className={`pi__button-container ${(focused) ? 'focused' : ''}`}>
        {focused &&
          <div className="pi__button-inputs-container">
            <div className="pi__button-input-wrapper">
              <input
                placeholder="Text here"
                value={item.Text}
                ref={(ref) => this.input = ref}
                onChange={(e) => this.handleKeys(e, 'Text')}
                className="pi__button-input"
              />
            </div>
            <div className="pi__button-input-wrapper flexrow">
              <span>URL</span>
              <input
                placeholder="https://google.com"
                value={item.Link}
                onBlurCapture={(e) => this.handleBlur(e)}
                onChange={(e) => this.handleKeys(e, 'Link')}
                className="pi__url-input"
              />
            </div>
          </div>
        }
        {!focused &&
          <span className="pi__button-preview">{(item.Text.length) ? item.Text : 'No Text'}</span>
        }
      </div>
    )
  }
}