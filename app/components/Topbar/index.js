import React from 'react';
import PropTypes from 'prop-types';

const Topbar = props => (
  <div className="topbar">
    <div className="logo">
      <div className="logo__image"></div>
      <div className="logo__text">{props.title}</div>
    </div>
    <nav className="menu menu_horizontal">
      <a className="menu__item" href="//kanobu.ru/games/">Игры</a>
      <a className="menu__item" href="//kanobu.ru/news/">Новости</a>
      <a className="menu__item" href="//kanobu.ru/articles/">Статьи</a>
      <a className="menu__item" href="//kanobu.ru/reviews/">Рецензии</a>
      <a className="menu__item" href="//kanobu.ru/pub/">Паб</a>
      <a className="menu__item" href="//kanobu.ru/shouts/all/">Вопли</a>
      <a className="menu__item" href="//kanobu.ru/project/cybersport/">Киберспорт</a>
    </nav>
    <a className="back-to-knb" href="//kanobu.ru/">Перейти на kanobu.ru</a>
  </div>
);

Topbar.propTypes = {
  title: PropTypes.string,
}

Topbar.defaultProps = {
  title: 'Канобу E3 2017',
}

export default Topbar;