import 'isomorphic-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import Sharing from '../Sharing';

class Bingo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      textActive: false,
      saveActive: false,
      saveText: 'Сохранить',
      text: '',
      rocketActive: false,
    }
  }

  /**
   * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
   * images to fit into a certain area.
   *
   * @param {Number} srcWidth Source area width
   * @param {Number} srcHeight Source area height
   * @param {Number} maxWidth Fittable area maximum available width
   * @param {Number} maxHeight Fittable area maximum available height
   * @return {Object} { width, heigth }
  */
  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  }

  componentDidMount() {
    const canvas = new fabric.Canvas('bingo');
    const bg = this.props.bingo && this.props.bingo.img || '/static/bingo_bg.jpg';
    fabric.Image.fromURL(bg, (img) => {
      img.set({
        left: 0,
        top: 0,
        angle: 0,
        selectable: false,
        hoverCursor: 'default'
      }, { crossOrigin: 'Anonymous' });
      canvas.add(img);
    });
    this.setState(Object.assign({}, this.state, { canvas }));
  }

  switchText(type) {
    if (type) document.getElementById('text').focus();
    this.setState(Object.assign({}, this.state, { textActive: type, text: '' }));
  }

  handleUpdateText(event) {
    event.preventDefault();
    this.setState(Object.assign({}, this.state, { text: event.target.value || ''}));
  }

  addText() {
    const canvas = this.state.canvas;
    const string = this.state.text.replace(' ','\n').toUpperCase();

    const text = new fabric.IText(string, {
      left: 300,
      top: 500,
      stroke: '#fff',
      strokeWidth: 1,
      fontFamily: 'Roboto',
      fontSize: 22,
      textAlign: 'center',
      fontWeight: 900,
    });

    canvas.add(text);

    this.setState(Object.assign({}, this.state, {
      textActive: false,
      text: '',
      canvas
    }));
  }

  chooseImage() {
    // click on button
    document.getElementById('image').click();
  }

  addImage() {
    const canvas = this.state.canvas;

    const image = document.getElementById('image').files[0];
    const fileReader = new FileReader();

    // check if we even got an image
    if (image) fileReader.readAsDataURL(image);

    // wait for it to load
      fileReader.onloadend = () => {
        fabric.Image.fromURL(fileReader.result, (img) => {
          const dimensions = this.calculateAspectRatioFit(img.width, img.height, 107, 107);
          img.set({
            originX: 'center',
            originY: 'center',
            width: dimensions.width,
            height: dimensions.height,
            top: 500,
            left: 350,
          })
          canvas.add(img);
          this.setState(Object.assign({}, this.state, { canvas }));
        }, { crossOrigin: 'Anonymous' });
      }
  }

  switchSave(type) {
    let saveText = 'Сохраняем';
    if (!type) saveText = 'Сохранить';
    this.setState(Object.assign({}, this.state, { saveActive: type, saveText }));
    // emulate internet delay
    if (type) {
      const canvas = this.state.canvas;
      const url = this.props.bingo && this.props.bingo.bingoId && `http://e3.kanobu.ru/api/bingo/${this.props.bingo.bingoId}` || 'http://e3.kanobu.ru/api/bingo';
      const method = this.props.bingo && this.props.bingo.bintoId && 'PUT' || 'POST'
      fetch(url, {
        method,
        body: JSON.stringify({
          base64img: this.renderImage(canvas),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json())
      .then((json) => {
        this.props.onUpdateBingo(json.results);
        this.setState(Object.assign({}, this.state, { saveText: 'Сохранено' }));
      })
      .catch((err) => console.log(err));
    }
  }

  renderImage(canvas) {
    canvas.deactivateAll().renderAll();
    canvas.selection = false;
    return canvas.toDataURL({ format: 'jpeg', quality: 0.8 });
  }

  saveImage() {
    const canvas = this.state.canvas;
    
    const imgUrl = this.renderImage(canvas);

    const link = document.createElement('a');
    link.download = 'kanobu_e3_bingo.jpg';
    link.href = imgUrl;
    link.target = "_blank";
    link.click();
    link.remove();

    this.setState(Object.assign({}, this.stae, { canvas }));
  }

  render() {
    return (
      <div className="bingo">
        <div className="bingo__desc bingo__desc_intro">
          <div className="bingo__desc-text">
            <div className="bingo__desc-title">О бинго</div>
            Е3 – конференция, на которой совершаются все главные анонсы года. Поэтому мы предлагаем вам сделать свои предсказания в формате Бинго!
            <br /><br />
            Задача проста: заполните все клетки с помощью конструктора ниже. Можно указывать все что угодно, от серьезных анонсов, до мемов.
            <br /><br />
            <b>Подсказка:</b> чтобы отредактировать только что добавленный текст – дважды кликните по нему, для перевода строки используйте Shift+Enter. Вы всегда сможете дополнить Бинго используя вашу персональную ссылку.
          </div>
        </div>
        <canvas className="bingo__canvas" id="bingo" width="650" height="836"></canvas>
        <div className="bingo__controls controls">
          <div
            className={`controls__block ${this.state.textActive && 'controls__block_expanded'}`}
          >
            <div
              className="controls__button controls__button_text"
              onClick={this.switchText.bind(this, true)}
            >Добавить текст</div>
            <div
              className={`controls__field ${this.state.textActive && 'controls__field_visible'}`}
            >
              <input
                className="controls__input"
                type="text"
                id="text"
                placeholder="TV TV TV"
                value={this.state.text}
                onChange={this.handleUpdateText.bind(this)}
                onSubmit={this.addText.bind(this)}
              />
            </div>
            <div
              className={`controls__func-button controls__func-button_add ${this.state.textActive && 'controls__func-button_visible'}`}
              onClick={this.addText.bind(this)}
            ></div>
            <div
              className={`controls__func-button controls__func-button_close ${this.state.textActive && 'controls__func-button_visible'}`}
              onClick={this.switchText.bind(this, false)}
            ></div>
          </div>
          <div className="controls__block">
            <div
              className="controls__button controls__button_image"
              onClick={this.chooseImage}
            >Добавить картинку</div>
            <div className="controls__field controls__field_hidden">
              <input
                id="image"
                className="controls__input"
                type="file"
                onChange={this.addImage.bind(this)}
              />
            </div>
          </div>
          <div
            className={`controls__block ${this.state.saveActive && 'controls__block_expanded'}`}
          >
            <div
              className="controls__button controls__button_save"
              onClick={this.switchSave.bind(this, true)}
            >{this.state.saveText}</div>
            <div
              className={`controls__button controls__button_download ${!this.state.saveActive && 'controls__button_hidden'}`}
              onClick={this.saveImage.bind(this)}
            >Скачать</div>
            <div
              className={`controls__button controls__button_share ${!this.state.saveActive && 'controls__button_hidden'}`}
            >
              <Sharing
                url={`http://e3.kanobu.ru/?public=${this.props.bingo.publicId}`}
                text="Бинго «Канобу» снова в деле! Создай свое Бинго и поучаствуй в розыгрыше двух PS4 Pro от «Рокетбанка»"
                height="auto"
              />
            </div>
            <div
              className={`controls__func-button controls__func-button_close ${this.state.saveActive && 'controls__func-button_visible'}`}
              onClick={this.switchSave.bind(this, false)}
            ></div>
          </div>
        </div>
        <div className="bingo__desc">
          <div className="bingo__desc-text">
            <div className="bingo__desc-title">Прием работ закрыт. Спасибо за участие!</div>
            В этом году «Рокетбанк» и «Канобу» также проведут конкурс, в котором разыграют целых <b>две PS4 Pro</b> среди всех кто создаст Бинго, а также закажет и активирует карту, нажав на кнопку «Заказать» и заполнив форму ниже.
            <br /><br />
            Заказ и обслуживание карты абсолютно бесплатны, а значит – вы ничего не теряете, потому участвуйте и зовите друзей! А также не забывайте про наш второй совместный конкурс, где <a href="http://kanobu.ru/project/pasha" target="_blank">вам предстоит сбрить усы Пивоварова</a> ;)
          </div>
        </div>
      </div>
    )
  }
}

Bingo.propTypes = {
  bingo: PropTypes.shape({
    img: PropTypes.string,
    bingoId: PropTypes.string,
    publicId: PropTypes.string,
    pubLink: PropTypes.string,
    link: PropTypes.link,
    activated: PropTypes.bool,
  }),
}

Bingo.defaultProps = {
  bingo: {
    img: null,
    bingoId: null,
    publicId: null,
    pubLink: null,
    link: null,
    activated: false,
  },
};

export default Bingo