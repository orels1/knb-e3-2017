/**
 * Created by orel- on 24/May/17.
 */
import React from 'react';
import { filter, findIndex } from 'lodash';
import moment from 'moment';

import Topbar from '../Topbar';
import Partners from '../Partners';
import StreamEmbed from '../StreamEmbed';
import StreamSchedule from '../StreamSchedule';
import StreamMenu from '../StreamMenu';
import Carousel from '../Carousel';
import News from '../News';
import Bingo from '../Bingo';
import Footer from '../Footer';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      streams: [],
      streamType: 'kanobu',
      next: {},
      globalStyle: '',
      bingo: false,
      showBingo: false,
      activeStream: {},
      news: [],
      articles: [],
      page: 1,
      carousel_page: 1,
      searchString: '',
      searchResults: [],
    }, props.data);

    // check which stream is next and set data accordingly
    let next = {};
    let activeStream = {};
    let globalStyle = '';
    const now = moment();
    for (let stream of this.props.data.streams) {
      // if stream is currently active
      if (moment(stream.start).isBefore(now) && moment().isBefore(moment(stream.start).add(1, 'hour').add(30, 'minutes'))) {
        next = stream;
        next.current = true;
        activeStream = stream;    
        globalStyle = stream.id;  
        Object.assign(this.state, { next, activeStream, globalStyle });
        break;
      }
      // if stream will be in the future - save it and break
      if (moment(stream.start).isAfter(now)) {
        next = stream;
        activeStream = this.props.data.streams[0];
        globalStyle = this.props.data.streams[0].id;
        Object.assign(this.state, { next, activeStream, globalStyle });
        break;
      }
      // continue to the next if stream has already passed
    }

    // if no future streams were found - farewell!
    if (Object.keys(next).length === 0) {
      next = {
        id: 'ea',
        start: '2017-06-10T22:00',
        name: 'E3 ЗАВЕРШЕНА',
        ended: true,
      }
      activeStream = this.props.data.streams[0];
      globalStyle = this.props.data.streams[0].id;
      Object.assign(this.state, { next, activeStream, globalStyle });
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  showMore() {
    this.setState(Object.assign({}, this.state, { page: this.state.page + 1 }));
  }

  updateSearch(event) {
    this.setState(Object.assign({},
      this.state,
      {
        searchString: event.target.value || '',
        searchResults: filter(this.state.news, item => new RegExp(event.target.value || '', 'i').test(item.title)),
      }));
  }

  /**
   * Switch between different streams
   * @param {string} id 
   */
  switchStream(id) {
    let newStreams = this.state.streams;
    // get current active stream index
    let activeIndex = findIndex(newStreams, i => i.active);
    // get selected stream index
    let newIndex = findIndex(newStreams, i => i.id === id);
    // if they are different - change the active stream
    if (newIndex !== activeIndex) {
      newStreams[activeIndex].active = false;
      newStreams[newIndex].active = true;
      // update state
      this.setState(Object.assign({}, this.state, {
        streams: newStreams,
        globalStyle: id,
        activeStream: newStreams[newIndex],
      }));
    }
  }

  switchType(type) {
    this.setState(Object.assign({}, this.state, { streamType: type }));
  }

  switchPage(id) {
    this.setState(Object.assign({}, this.state, { carousel_page: id }));
  }

  switchBingo(type) {
    this.setState(Object.assign({}, this.state, { showBingo: type }));
  }

  updateBingo(json) {
    window.history.replaceState({}, document.title, `?public=${json.publicId}`);
    this.setState(Object.assign({}, this.state, { bingo: json }));
  }

  render() {
    return (
      <div className="home">
        <Topbar />
        <section className="header">
          <Partners />
          <div className="streams container">
            <StreamEmbed stream={this.state.activeStream} type={this.state.streamType} />
            <StreamSchedule
              streams={this.state.streams}
              next={this.state.next}
              onSwitchStream={this.switchStream.bind(this)}
              style={this.state.globalStyle}
            />
            <StreamMenu
              stream={this.state.activeStream.links}
              onSwitchType={this.switchType.bind(this)}
              type={this.state.streamType}
            />
          </div>
          <div className={`header__bg header__bg_${this.state.globalStyle}`} />
        </section>
        <section className="articles">
          <Carousel 
            title="Статьи"
            items={this.state.articles}
            page={this.state.carousel_page}
            onSwitchPage={this.switchPage.bind(this)}
          />
        </section>
        <section className="the-rest">
          <div className="switcher container">
            <div className="switcher__block">
              <div
                className={`switcher__item ${!this.state.showBingo && 'switcher__item_active'}`}
                onClick={this.switchBingo.bind(this, false)}
              >Новости и Трейлеры</div>
              <div
                className={`switcher__item ${this.state.showBingo && 'switcher__item_active'}`}
                onClick={this.switchBingo.bind(this, true)}
              >Бинго</div>
            </div>
            <div className="search switcher__search">
              <input
                className="search__field"
                value={this.searchString}
                onChange={this.updateSearch.bind(this)}
                type="text"
                placeholder="Поиск"
              />
              <div className="search__icon"></div>
            </div>
          </div>
          <div className="double-wrapper container">
            {!this.state.showBingo &&
              <News items={this.state.searchString.length > 2 ? this.state.searchResults : this.state.news} limit={this.state.page} />
            ||
              <Bingo bingo={this.state.bingo && this.state.bingo} onUpdateBingo={this.updateBingo.bind(this)} />
            }
            {!this.state.showBingo &&
              <div className="banner banner_240x400"></div>
            }
          </div>
          {this.state.page * 10 < this.state.news.length && !this.state.showBingo &&
            <div className="show-more container">
              <div className="show-more__button" onClick={this.showMore.bind(this)}>Показать еще</div>
            </div>
          }
        </section>
        <section className="footer-container">
          <Footer />
        </section>
      </div>
    );
  }
}

export default Home;
