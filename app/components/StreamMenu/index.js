import React from 'react';
import PropTypes from 'prop-types';

import Sharing from '../Sharing';

class StreamMenu extends React.Component {
  handleOnClick(type) {
    this.props.onSwitchType(type);
  }

  render() {
    return (
      <div className="stream-menu">
        <div className="stream-menu__block">
          <div className="stream-menu__title">Трансляции:</div>
          <div className="stream-toggler">
            {Object.keys(this.props.stream).includes('kanobu') &&
              <div
                className={`stream-toggler__item ${this.props.type === 'kanobu' && 'stream-toggler__item_active'} stream-toggler__item_kanobu`}
                onClick={this.handleOnClick.bind(this, 'kanobu')}
              >Канобу</div>
            }
            {Object.keys(this.props.stream).includes('original') &&
              <div
                className={`stream-toggler__item ${this.props.type === 'original' && 'stream-toggler__item_active'} stream-toggler__item_original`}
                onClick={this.handleOnClick.bind(this, 'original')}
              >Оригинал</div>
            }
            {Object.keys(this.props.stream).includes('text') &&
              <div
                className={`stream-toggler__item ${this.props.type === 'text' && 'stream-toggler__item_active'} stream-toggler__item_text`}
                onClick={this.handleOnClick.bind(this, 'text')}
              >Текст</div>
            }
          </div>
        </div>
        <div className="stream-menu__block stream-menu__block_sharing">
          <div className="stream-menu__title">Поделиться:</div>
          <Sharing />
        </div>
      </div>
    );
  }
};

export default StreamMenu;