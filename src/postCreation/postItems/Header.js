import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import './styles/header.css'

class Header extends Component {
  componentDidMount = () => {
    if (this.props.focused) {
      this.input.focus();
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.focused) { this.input.focus() }
    else { this.input.blur() }
  } 

  handleKeys = (e) => {
    const { item, update } = this.props;
    update({...item, Text: e.target.value});
  }

  render() {
    const { item } = this.props;
    return <TextareaAutosize
      value={item.Text}
      innerRef={(ref) => this.input = ref}
      onChange={this.handleKeys}
      className="pi__header"
    />
  }
}

export default Header;