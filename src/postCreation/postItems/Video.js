import React, {Component} from 'react';
import YouTube from 'react-youtube'

import './styles/video.css';

export default class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showVideo: (props.item.SourceName.length > 10),
      videoURL: null,
      videoID: this.parseYoutubeURL(props.item.SourceName),
    }
  }

  componentDidMount = () => {
    if (this.props.focused && !this.state.showVideo) {
      this.input.focus();
    }

    if (!this.input) { return; }
    this.input.onblur = () => {
      const { item, update } = this.props;
      const itemClone = {...item};
      const id = this.parseYoutubeURL(this.input.value);

      if (!id || id.length <= 4) { return; }

      itemClone.SourceName = id;
      update(itemClone);
      
      this.setState({
        videoID: id,
        showVideo: true,
      })
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.focused && !this.state.showVideo && !prevProps.focused) { this.input.focus() }
  }

  parseYoutubeURL = (url) => {
    let videoID = '';
    if (Array.isArray(url)) { return url[0]; }
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      videoID = url[2].split(/[^0-9a-z_\-]/i);
      videoID = videoID[0];
    }
    else {
      videoID = url[0];
    }
    return videoID;
  }

  handleKeys = (e) => {
    const { item, update } = this.props;
    const itemClone = {...item};

    if (e.key === 'Enter') {
      const id = this.parseYoutubeURL(e.target.value);

      if (!id) { return } // alert something went wrong
      itemClone.SourceName = id;

      update(itemClone);

      this.setState({ videoID: id, showVideo: true });
    }
  }

  onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render () {
    const { focused } = this.props;
    const { showVideo, videoID } = this.state;

    const opts =  {
      height: '227',
      width: '400',
      playerVars: {
        autoplay: 0
      }
    }

    return (
      <div className={`pi__video-container ${(focused) ? 'focused' : ''}`}>
        {(showVideo) &&
          <YouTube
            videoId={videoID}
            opts={opts}
            onReady={this.onReady}
            className="youtube-player"
          />
        }
        {(!showVideo) &&
          <input
            placeholder="Paste youtube URL here"
            ref={(ref) => this.input = ref}
            onKeyDown={this.handleKeys}
            type="text"
            className="pi__video-input"
          />
        }
      </div>
    )
  }
}