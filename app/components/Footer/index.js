import React from 'react';
import PropTypes from 'prop-types';

import Sharing from '../Sharing';

const Footer = props => (
  <div className="footer">
    <div className="footer__toplinks">
      <div className="links-list">
        <a className="links-list__item" href="https://rocketbank.ru/pages/kanobu-e3-rules" target="_blank">Условия акции</a>
      </div>
      <Sharing />
    </div>
    <div className="footer__description">
      Этот раздел Канобу посвящен E3 2017. Здесь вы сможете найти расписание и даты проведения выставки, все новости, трейлеры, видео, трансляции и игры конференции, а также любую другую информацию о E3 2017.
    </div>
    <div className="footer__bottom-info">
      <div className="footer__copyright">&copy; 2008-2017 Kanobu network</div>
      <div className="footer__age">18+</div>
    </div>
  </div>
);

export default Footer;