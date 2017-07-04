import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

moment.locale('ru');

// TODO: Add type checks with map and .include

const News = (props) => {
  const items = props.items.map((item, index) => (
    <div className="news__item" key={item.link + index}>
      <a href={item.link}>
        <div className="news__item-image-container">
          {item.tags.includes('трейлер') && 
            <div className="news__item-trailer-overlay"></div>
          }
          <div className={`news__item-image-filter ${item.tags.includes('трейлер') && 'news__item-image-filter_trailer'}`}></div>
          <div className="news__item-image" style={{ backgroundImage: `url('${item.pic}')`}}></div>
        </div>
      </a>
      <div className="news__item-info">
        <a href={item.link}>
          <h3 className="news__item-title">{item.title}</h3>
        </a>
        <div className="news__item-data">
          {item.tags.includes('трейлер') && 
            <a className="news__item-type" href="//kanobu.ru/tags/trejler/">
              Трейлеры
            </a>
          ||
            <a className="news__item-type" href="//kanobu.ru/news/">
              Новости
            </a>
          }
          <div className="news__item-separator">|</div>
          <div className="news__item-published">{moment(item.pubdate, 'YYYY-MM-DDTHH:mm:ss').fromNow()}</div>
        </div>
      </div>
    </div>
  ))
  return (
    <div className="news">
      {(props.limit > 0 && items.slice(0, props.limit * 10)) || items}
    </div>
  );
};

News.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    pic: PropTypes.string.isRequired,
    pubdate: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
  })).isRequired,
  limit: PropTypes.number,
}

News.defaultProps = {
  limit: 0,
}

export default News;