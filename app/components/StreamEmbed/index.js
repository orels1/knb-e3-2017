import React from 'react';
import PropTypes from 'prop-types';

const StreamEmbed = props => (
  <div className="stream-embed">
    <div className="responsive-container">
      {!props.stream.placeholder &&
        <iframe width="100%" height="100%" src={props.stream.links[props.type].replace('https://youtu.be/', 'https://www.youtube.com/embed/') + '?rel=0&amp;showinfo=0'} frameBorder="0" allowFullScreen></iframe>
      ||
        <img src="/static/placeholder.jpg" width="100%" height="100%" />
      }
    </div>
  </div>
);

StreamEmbed.propTypes = {
  stream: PropTypes.shape({
    links: PropTypes.shape({
      kanobu: PropTypes.string.isRequired,
      original: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
    placeholder: PropTypes.bool,
  }).isRequired,
  type: PropTypes.string.isRequired,
}

StreamEmbed.defaultProps = {
  stream: {
    placeholder: false,
  },
};

export default StreamEmbed;