import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

moment.locale('ru');

// TODO: add timer

class StreamSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: false,
    };
  }

  handleOnClick(id) {
    this.props.onSwitchStream(id);
  }

  componentWillMount() {
    const time = moment(this.props.next.start);
    const currTime = moment();
    const dur = moment.duration(time.diff(currTime));
    this.setState(Object.assign({}, this.state, { timeLeft: dur }));
  }

  componentDidMount() {
    setInterval(() => {
      const time = moment(this.props.next.start);
      const currTime = moment();
      const dur = moment.duration(time.diff(currTime));
      this.setState(Object.assign({}, this.state, { timeLeft: dur }));
    }, 1000);
  }

  render() {
    const streamList = this.props.streams.map(stream => (
      <div
        key={stream.id}
        className={`stream-list__item stream-list__item_${this.props.style} ${stream.active && `stream-list__item_${this.props.style}_active`}`}
        onClick={this.handleOnClick.bind(this, stream.id)}
      >
        <div className={`stream-list__name stream-list__name_${stream.id}`}>
          <div className={`stream-list__title stream-list__title_${stream.id}`}>
            {stream.name}
          </div>
        </div>
        <div className="timer-due timer-due_vertical">
          <div className="timer-due__date">{moment(stream.start).format('YYYY-MM-DD')}</div>
          <div className="timer-due__time">{moment(stream.start).format('HH:mm')} МСК</div>
        </div>
      </div>
    ));
    
    return (
      <div className="stream-schedule">
        {!this.props.next.current && !this.props.next.ended &&
          <div className={`stream-schedule__next stream-schedule__next_${this.props.style}`}>
            <div className="stream-schedule__next-name"><span>{this.props.next.name}</span><small>скоро</small></div>
            <div className="timer stream-schedule__timer">
              <div className="timer-value">
                <div className="timer-value__hours">
                  {
                    this.state.timeLeft.asHours() < 10 ?
                    `0${Math.floor(this.state.timeLeft.asHours())}` :
                    Math.floor(this.state.timeLeft.asHours())
                  }
                </div>
                <div className="timer-value__separator">:</div>
                <div className="timer-value__minutes">
                  {
                    this.state.timeLeft.minutes() < 10 ?
                    `0${this.state.timeLeft.minutes()}` :
                    this.state.timeLeft.minutes()
                  }
                </div>
                <div className="timer-value__separator">:</div>
                <div className="timer-value__seconds">
                  {
                    this.state.timeLeft.seconds() < 10 ?
                    `0${this.state.timeLeft.seconds()}` :
                    this.state.timeLeft.seconds()
                  }
                </div>
              </div>
              <div className="timer-due timer-due_horizontal">
                <div className="timer-due__date">{moment(this.props.next.start).format('YYYY-MM-DD')}</div>
                <div className="timer-due__time">{moment(this.props.next.start).format('HH:mm')} МСК</div>
              </div>
            </div>
          </div>
        || !this.props.next.ended &&
          <div className={`stream-schedule__next stream-schedule__next_${this.props.style}`}>
            <div className="stream-schedule__next-name"><span>{this.props.next.name}</span>
              <small>
                идет трансляция
              </small>
            </div>
          </div>
        ||
          <div className={`stream-schedule__next stream-schedule__next_${this.props.style}`}>
            <div className="stream-schedule__next-name"><span>{this.props.next.name}</span></div>
          </div>
        }
        <div className="stream-list">
          {streamList}
        </div>
      </div>
    );
  }
};

StreamSchedule.propTypes = {
  streams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
  })).isRequired,
  next: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    ended : PropTypes.bool,
  }),
  onSwitchStream: PropTypes.func.isRequired,
  style: PropTypes.string.isRequired,
}

StreamSchedule.defaultProps = {
  next: {
    ended: false,
  }
}

export default StreamSchedule;