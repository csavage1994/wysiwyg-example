import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

import ContentSelectionHeader from './ContentSelectionHeader';
import ContentEditor from './ContentEditor';

import {
  textObject,
  headerObject,
  quoteObject,
  videoObject,
  dividerObject,
  buttonObject,
} from './itemDefaults.js';

const typeMap = {
  text: textObject,
  header: headerObject,
  quote: quoteObject,
  video: videoObject,
  divider: dividerObject,
  button: buttonObject,
}

const typeOrder = ['text', 'header', 'quote', 'video', 'button', 'divider'];

const trackedKeys = ['Alt', 'Control'];

class PostCreator extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedType: 'text',
      postContent: props.initialData || [],
      focusIndex: null,
      stagedDeletionIndex: null,
    };
  }

  // Handles tracking if alt/ctrl keys are pressed for shortcuts
  keyState = {}
  
  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleClickOutside = () => {
    const { focusIndex } = this.state;

    if (focusIndex === null) { return }

    this.setState({focusIndex: null})
  }

  /*
  * Handles keyboard shortcuts based on current state of alt/ctrl keys
  * 
  * Alt/Option + Arrow Up/Down = Move focus up/down. This isn't control b/c it causes issues on macs
  * Control + Backspace = Stage current item for deletion. If already staged, deletes current item
  * Control + i = Insert item above current focused item
  * Control + k = Insert item below current focused item
  * Control + [1-7] = Update selected content type, same order as types in header
  * Escape = Remove any focus, unstage any staged deletion
  */
  handleKeyDown = (e) => {
    const { focusIndex, postContent, stagedDeletionIndex } = this.state;
    const { Alt, Control } = this.keyState;

    if (trackedKeys.indexOf(e.key) >= 0) { this.keyState[e.key] = true }

    if (e.key === 'Escape') { this.setState({ focusIndex: null, stagedDeletionIndex: null }) }

    // change focus up and down
    if (e.key === 'ArrowUp' && Alt) {
      if (focusIndex === 0) { return }

      this.setState({ focusIndex: Math.max((focusIndex - 1), 0), stagedDeletionIndex: null });
    } else if (e.key === 'ArrowDown' && Alt) {
      if (focusIndex === (postContent.length - 1)) { return }

      this.setState({ focusIndex: (focusIndex + 1), stagedDeletionIndex: null });
    }

    // delete item that's currently focused
    if (e.key === 'Backspace' && Control) {
      if (typeof stagedDeletionIndex === 'number') {
        const contentClone = [...postContent];
        contentClone.splice(stagedDeletionIndex, 1);

        this.setState({ postContent: contentClone, stagedDeletionIndex: null, focusIndex: Math.max(stagedDeletionIndex - 1, 0) });
      } else {
        this.setState({ stagedDeletionIndex: focusIndex });
      }
    }

    // insert item at current focus index
    if (e.key === 'i' && Control) {
      this.addModule(focusIndex);
    }
    if (e.key === 'k' && Control) { // insert below
      this.addModule(Math.min(focusIndex + 1, postContent.length));
    }

    // change selected module type
    if (!isNaN(e.key) && Control && parseInt(e.key) <= typeOrder.length) {
      const newType = typeOrder[parseInt(e.key) - 1];

      // update focused modules's type if it's a type of text
      if (
        focusIndex !== null &&
        postContent[focusIndex] &&
        postContent[focusIndex].Type === "Label" &&
        ['text', 'header', 'quote'].indexOf(newType) >= 0
      ) {
        const contentClone = [...postContent];
        const updateMap = {
          text: 'Text',
          header: 'H1',
          quote: 'Quote',
        }

        contentClone[focusIndex].Property = updateMap[newType];

        this.setState({ postContent: contentClone });
      }
      this.setState({ selectedType: newType });
    }
  }

  handleKeyUp = (e) => {
    if (trackedKeys.indexOf(e.key) < 0) { return }

    this.keyState[e.key] = false;
  }

  addModule = (index) => {
    const { selectedType, postContent } = this.state;
    let contentClone = [...postContent];

    const item = typeMap[selectedType];

    if (typeof index === 'number') {
      contentClone.splice(index, 0, item);
      contentClone = this.cleanContent(contentClone, index);
      this.setState({ postContent: contentClone, focusIndex: index });
      return;
    }

    contentClone = this.cleanContent(contentClone);
    this.setState({ postContent: [...contentClone, item], focusIndex: contentClone.length });

    if (this.contentList) {
      this.contentList.scrollTo(0, 99999);
    }
  }

  // Removes any item with no content, except at the preserveIndex
  cleanContent = (contentClone, preserveIndex) => {
    const cleaned = contentClone.filter((cur, i) => {
      if (i === preserveIndex) { return true }
      if (cur.Type === 'Label' && cur.Text.length > 0) { return true }
      if (cur.Type === 'Video' && cur.SourceName.length > 0) { return true }
      if (cur.Type === 'Gallery' && cur.Images.length > 0) { return true }
      if (cur.Type === 'Button' && (cur.Link.length > 0 || cur.Text.length > 0)) { return true }
      if (cur.Type === 'Divider') { return true }
    });

    return cleaned;
  }

  removeModule = (index) => {
    const { postContent } = this.state;
    const contentClone = [...postContent];

    contentClone.splice(index, 1);

    this.setState({ postContent: contentClone });
  }

  updateModuleType = (type) => {
    const { focusIndex, postContent } = this.state;
    const contentClone = [...postContent];
    const updateMap = {
      text: 'Text',
      header: 'H1',
      quote: 'Quote',
    };

    // Update type without layout change. Types in array cannot be converted to others
    if (focusIndex === null || ['video', 'button', 'divider'].indexOf(type) >= 0) {
      this.setState({ selectedType: type });
      return;
    }

    contentClone[focusIndex].Property = updateMap[type];
    this.setState({ postContent: contentClone, selectedType: type });
  }

  updateModuleContent = (updated, index) => {
    const { postContent } = this.state;
    const { Alt, Control } = this.keyState;
    const contentClone = [...postContent];

    if (Alt || Control) { return } // don't want to modify content while they're doing keyboard shortcuts

    contentClone[index] = updated;

    this.setState({ postContent: contentClone });
  }

  updateModuleOrder = (newContent) => {
    this.setState({ postContent: newContent });
  }

  render() {
    const { selectedType, postContent, focusIndex, stagedDeletionIndex } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: '1', maxHeight: '100vh' }}>
        <ContentSelectionHeader selectType={this.updateModuleType} contentType={selectedType} />
        <ContentEditor
          focusIndex={focusIndex}
          setFocus={(i) => this.setState({ focusIndex: i })}
          removeModule={this.removeModule}
          updateOrder={this.updateModuleOrder}
          updateModule={this.updateModuleContent}
          content={postContent}
          addItem={this.addModule}
          stagedDeletionIndex={stagedDeletionIndex}
          attach={(name, ref) => this[name] = ref}
        />
      </div>
    )
  }
}

export default onClickOutside(PostCreator);