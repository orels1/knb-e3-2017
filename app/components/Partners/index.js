import React from 'react';
import PropTypes from 'prop-types';

const Partners = props => (
  <div className="partners header__partners container">
    <div className="partners__name-container">      
      <h1 className="partners__name">{props.title}</h1>
      <small>{props.subtitle}</small>
    </div>

    <div className="partners__list">
      <div className="partners__list-title">При поддержке</div>
      <div className="partners__list-item">
        <div className="parnters__list-item-img">
          <a href="https://ad.adriver.ru/cgi-bin/click.cgi?sid=1&ad=627055&bt=21&pid=2581554&bid=5104678&bn=5104678&rnd=274605550" target="_blank">
            <img width="1" height="1" src="https://ad.adriver.ru/cgi-bin/rle.cgi?sid=1&ad=627055&bt=21&pid=2581554&bid=5104678&bn=5104678&rnd=274605550" />
            <img src="/static/flash-logo.png" />
          </a>
        </div>
        <div className="partners__list-item-rank">Генеральный партнер</div>
      </div>
      <div className="partners__list-item">
        <div className="parnters__list-item-img">
          <a href="http://rckb.co/2rWKQlt" target="_blank"><img src="/static/logo-rocket.png" /></a>
        </div>
        <div className="partners__list-item-rank">Партнер</div>
      </div>
    </div>
  </div>
);

Partners.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

Partners.defaultProps = {
  title: 'E3 2017',
  subtitle: 'На Канобу',
}

export default Partners;