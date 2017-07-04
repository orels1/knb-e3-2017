import React from 'react';
import PropTypes from 'prop-types';

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: this.props.page,
      shift: 0,
    }
  }

  handleSwitchPage(id) {
    this.props.onSwitchPage(id);
  }

  componentWillReceiveProps(nextProps){
    // check if we move forwards to update limit before render
    if (this.props.page < nextProps.page) {
      this.setState(Object.assign({}, this.state, { limit: nextProps.page }))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // check if we switched pages
    if (prevProps.page !== this.props.page) {
      // if we moved forwards
      if (prevProps.page < this.props.page) {
        // limit was already updated, so our component render with all the items we need
        // shift forwards for the amount we need
        this.setState(Object.assign({}, this.state, { shift: -1172 * (this.props.page - 1) }));
      }
      // if we moved backwards
      if (prevProps.page > this.props.page) {
        // shift backwards
        this.setState(Object.assign({}, this.state, { shift: -1172 * (this.props.page - 1) }));
        // we should update the limit only after the animation ends
        setTimeout(() => {
          this.setState(Object.assign({}, this.state, { limit: this.props.page }));
        }, 2000);
      }
    }
  }

  render() {
     const items = this.props.items.map((item, index) => (
      <a href={item.link} key={item.link + index}>
        <div className="carousel__item">
          <div className="carousel__item-filter"></div>
          <div className="carousel__item-bg" style={{ backgroundImage: `url('${item.pic}')`}}></div>
          <div className="carousel__item-info">
            <div className="carousel__item-title">{item.title}</div>
            {false && <div className="carousel__item-subtitle"></div>}
          </div>
        </div>
      </a>
    ));
    const nav_count = Math.ceil(this.props.items.length / 4);
    const nav_dots = [];
    for (let index = 0; index < nav_count; index++){
      nav_dots.push(
        <div
          key={`nav-${index}`}
          className={`carousel-nav__dot ${index + 1 === this.props.page && 'carousel-nav__dot_active'}`}
          onClick={this.handleSwitchPage.bind(this, index + 1)}
        ></div>
      );
    }

    return (
      <div className="wide-block">
        <div className="wide-header wide-header_black container">
          <div className="wide-header__title">{this.props.title}</div>
          <div className="wide-header__carousel-nav carousel-nav">
            { nav_dots }
          </div>
          <div className="wide-header__nav-buttons nav-buttons"></div>
        </div>
        <div className="carousel container">
          <div className="carousel__wrapper" style={{ transform: `translateX(${this.state.shift}px)`}}>
            { items.slice(0, 4 * this.state.limit) }
          </div>
        </div>
      </div>
    );
  }
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    pic: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  onSwitchPage: PropTypes.func.isRequired,
}

export default Carousel;