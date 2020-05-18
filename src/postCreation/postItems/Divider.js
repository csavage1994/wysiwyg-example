import React from 'react';

import './styles/divider.css';

const Divider = ({ focused }) => {
  return (
    <div className={`pi__divider-container ${(focused) ? 'focused' : ''}`}>
      <img src="https://dashboard.vamonde.com/static/media/content_divider_orange.0d8f78c4.svg" className="pi__divider" />
    </div>
  )
}

export default Divider;