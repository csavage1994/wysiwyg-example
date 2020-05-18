import React from 'react';

import './styles/contentSelectionHeader.css';

// Assets
import textIconWhite from '../assets/toolbar_text_white.svg';
import textIconBlue from '../assets/toolbar_text_dark.svg';
import headerIconWhite from '../assets/toolbar_header_white.svg';
import headerIconBlue from '../assets/toolbar_header_dark.svg';
import quotesIconWhite from '../assets/toolbar_quote_white.svg';
import quotesIconBlue from '../assets/toolbar_quote_dark.svg';
import videoIconWhite from '../assets/toolbar_video_white.svg';
import videoIconBlue from '../assets/toolbar_video_dark.svg';
import dividerIconWhite from '../assets/toolbar_divider_white.svg';
import dividerIconBlue from '../assets/toolbar_divider_dark.svg';

const ContentSelectionHeader = ({ selectType, contentType }) => {
  const textIcon = ((contentType === 'text' || contentType === 'Plain' || contentType === 'plain') ? textIconBlue : textIconWhite);
  const headerIcon = (contentType === 'header' ? headerIconBlue : headerIconWhite);
  const quotesIcon = (contentType === 'quote' ? quotesIconBlue : quotesIconWhite);
  const videoIcon = (contentType === 'video' ? videoIconBlue : videoIconWhite);
  const dividerIcon = (contentType === 'divider' ? dividerIconBlue : dividerIconWhite);

  return (
    <div className="CSH__container">
      <button onClick={() => selectType('text')} className={`CSH__content-type ${(contentType === "text") ? 'selected' : ''}`}>
        <img src={textIcon} alt="Text" className="CSH__type-image" />
      </button>
      <button onClick={() => selectType('header')} className={`CSH__content-type ${(contentType === "header") ? 'selected' : ''}`}>
        <img src={headerIcon} alt="Header" className="CSH__type-image" />
      </button>
      <button onClick={() => selectType('quote')} className={`CSH__content-type ${(contentType === "quote") ? 'selected' : ''}`}>
        <img src={quotesIcon} alt="Quote" className="CSH__type-image" />
      </button>
      <div className="content__styling-header__divide-icons" />
      <button onClick={() => selectType('video')} className={`CSH__content-type ${(contentType === "video") ? 'selected' : ''}`}>
        <img src={videoIcon} alt="Video" className="CSH__type-image" />
      </button>
      <div className="content__styling-header__divide-icons" />
      <button onClick={() => selectType('button')} className={`CSH__content-type ${(contentType === "button") ? 'selected' : ''}`}>
        <span className="CSH__button-display">BTN</span>
      </button>
      <div className="content__styling-header__divide-icons" />
      <button onClick={() => selectType('divider')} className={`CSH__content-type ${(contentType === "divider") ? 'selected' : ''}`}>
        <img src={dividerIcon} alt="Divider" className="CSH__type-image" />
      </button>
    </div>
  )
}

export default ContentSelectionHeader;