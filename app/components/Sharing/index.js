import React from 'react';
import PropTypes from 'prop-types';

class Sharing extends React.Component {
  constructor(props) {
    super(props);
  }

  share(network) {
    const left = screen.availWidth/2 - 310;
    const top = screen.availHeight/2 - 215;
    switch (network) {
      case 'vk':
        window.open(`https://vk.com/share.php?url=${this.props.url}&title=${encodeURIComponent(this.props.text)}`,
          'sharer', `toolbar=0,status=0,width=626,height=436,top=${top},left=${left}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/share?url=${this.props.url}&title=${encodeURIComponent(this.props.text)}`,
          'sharer', `toolbar=0,status=0,width=626,height=436,top=${top},left=${left}`);
        break;
      case 'facebook':
        window.open(`https://facebook.com/sharer/sharer.php?u=${this.props.url}`,
          'sharer', `toolbar=0,status=0,width=626,height=436,top=${top},left=${left}`);
        break;
      default: 
        window.open(`https://vk.com/share.php?url=${this.props.url}&text=${encodeURIComponent(this.props.text)}`,
          'sharer', `toolbar=0,status=0,width=626,height=436,top=${top},left=${left}`);
    }
  }

  render() {
    return (
      <div className="sharing" style={{ height: this.props.height }}>
        <div className="sharing__button sharing__button_vk" onClick={this.share.bind(this, 'vk')}></div>
        <div className="sharing__button sharing__button_fb" onClick={this.share.bind(this, 'facebook')}></div>
        <div className="sharing__button sharing__button_tw" onClick={this.share.bind(this, 'twitter')}></div>
      </div>
    )
  }
};

Sharing.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
  height: PropTypes.string,
}

Sharing.defaultProps = {
  url: 'http://e3.kanobu.ru',
  text: 'Е3 2017 на Канобу. Следи за крупнейшим игровым событием года вместе с нами.',
  height: '50px',
}

export default Sharing;