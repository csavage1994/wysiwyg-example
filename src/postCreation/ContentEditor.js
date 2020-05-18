import React, { Component } from 'react';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

import {
  Text,
  Header,
  Quote,
  Divider,
  Video,
  Button,
} from './postItems/index';

import './styles/contentEditor.css';

class ContentEditor extends Component {
  onSortEnd = ({oldIndex, newIndex}) => {
    const { content, updateOrder } = this.props;
    let contentClone = arrayMove([...content], oldIndex, newIndex);

    updateOrder(contentClone);
  };

  render() {
    return (
      <div className="contenteditor__container">
        <SortableContainer
          {...this.props}
          onSortEnd={this.onSortEnd}
          useDragHandle
          helperClass="sortableHelper"
          lockAxis="y"
        />
      </div>
    )
  }
};

const DragHandle = sortableHandle(() => <span className="contenteditor__drag-handle" onClick={(e) => e.stopPropagation()}></span>);

const SortableContainer = sortableContainer(({
  content,
  attach,
  updateModule,
  addItem,
  removeModule,
  focusIndex,
  setFocus,
  stagedDeletionIndex,
}) => {
  return (
    <ul
      onClick={(e) => {
        e.stopPropagation();
        addItem(); // handles clicks below last item
      }}
      className="contenteditor__sortable-container"
      ref={(ref) => attach('contentList', ref)}
    >
      {content.map((item, i) => {
        return (
          <React.Fragment key={`postitem_${i}`}>
            <li onClick={(e) => e.stopPropagation()} className="contenteditor__add-trigger">
              <button onClick={() => addItem(i)} className="contenteditor__trigger-button" />
            </li>
            <SortableModule
              focused={(focusIndex === i)}
              index={i}
              removeModule={removeModule}
              update={(content) => updateModule(content, i)}
              item={item}
              itemIndex={i} // index was coming back as undefined
              setFocus={() => setFocus(i)}
              pendingDeletion={(stagedDeletionIndex === i)}
            />
          </React.Fragment>
        )
      })}
    </ul>
  )
});

const SortableModule = sortableElement(({
  item,
  itemIndex,
  update,
  removeModule,
  focused,
  setFocus,
  pendingDeletion,
}) => {
  const ItemComponent = getComponent(item);
  if (!ItemComponent) {
    return (
      <li className="contenteditor__sortable-item"
        onClick={(e) => {
            e.stopPropagation();
            setFocus();
          }
        }>
        <DragHandle />
        <div className="contenteditor__no-module">This module is no longer supported</div>
        <img onClick={() => removeModule(itemIndex)} src="https://s3.amazonaws.com/vamonde.media/assets/close_button_white.png" alt="Remove module" className="contenteditor__remove-module" />
        <div className="contenteditor__deletion-confirmation-wrapper">
          <div className={`contenteditor__deletion-confirmation ${(pendingDeletion) ? 'visible' : ''}`}>Press <pre>CTRL + BACKSPACE</pre> again to remove</div>
        </div>
      </li>
    )
  }
  return (
    <li className="contenteditor__sortable-item"
      onClick={(e) => {
          e.stopPropagation();
          setFocus();
        }
      }>
      <DragHandle />
      <ItemComponent
        setFocus={setFocus}
        focused={focused}
        itemIndex={itemIndex}
        update={(content) => update(content, itemIndex)}
        item={item}
      />
      <img onClick={() => removeModule(itemIndex)} src="https://s3.amazonaws.com/vamonde.media/assets/close_button_white.png" alt="Remove module" className="contenteditor__remove-module" />
      <div className="contenteditor__deletion-confirmation-wrapper">
        <div className={`contenteditor__deletion-confirmation ${(pendingDeletion) ? 'visible' : ''}`}>Press <pre>CTRL + BACKSPACE</pre> again to remove</div>
      </div>
    </li>
  )
});

function getComponent(item) {
  const { Type, Property } = item;
  if (Type === 'Label' && Property === 'Text') {
    return Text;
  } else if ((Type === 'Label' && Property === 'H1') || (Type === 'Label' && Property === 'SubTitle')) {
    return Header;
  } else if (Type === 'Label' && Property === 'Quote') {
    return Quote;
  } else if (Type === 'Video') {
    return Video;
  } else if (Type === 'Divider') {
    return Divider;
  } else if (Type === 'Button') {
    return Button;
  }
  return null;
}

export default ContentEditor;