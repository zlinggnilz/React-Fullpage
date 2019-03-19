import React, { PureComponent } from 'react';
import styles from './full.scss';
import eventHandle from './eventHandle';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

export default class Full extends PureComponent {
  static propTypes = {
    className: PropTypes.string, // full wrap的class
    currentClassName: PropTypes.string, // 当前页面active的class
    isMobile: PropTypes.bool, // 是否是手机端
    list: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        autoHeight: PropTypes.bool,
        content: PropTypes.element.isRequired
      })
    ).isRequired, // 内容
    sectionClassName: PropTypes.string // full的section的class
  };

  static defaultProps = {
    isMobile: false,
    sectionClassName: '',
    currentClassName: '',
    className: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      offsetheight: window.innerHeight || document.documentElement.clientHeight, //获取当前页面的高度
      current: 0, //当前在第几页
      pageScrollHeight: 0,
      list: props.list
    };
    this.current = 0;
    this.animate = false;
  }

  componentDidMount() {
    const { isMobile } = this.props;
    if (isMobile) {
      this.removeScroll();
    }

    eventHandle.addEvent(document, 'mousewheel', this.scroll);
    eventHandle.addEvent(document, 'DOMMouseScroll', this.scroll);

    window.onresize = debounce(() => {
      this.setState({
        offsetheight: window.innerHeight || document.documentElement.clientHeight
      });
    }, 200);

    this.setList();
  }

  componentWillUnmount() {
    this.removeScroll();
    window.onresize = null;
  }

  setList() {
    const { list } = this.props;
    list.forEach(item => {
      item.ref = React.createRef();
    });
    this.setState({ list: Object.assign([], list) });
  }

  removeScroll() {
    eventHandle.removeEvent(document, 'mousewheel', this.scroll);
    eventHandle.removeEvent(document, 'DOMMouseScroll', this.scroll);
  }

  /**
   * 滑动或点击小点时跳转到相应的page
   */
  pageInfo = index => {
    this.current = index;
    this.setState({
      current: index,
      pageScrollHeight: this.getHeight(index)
    });
  };

  /**
   * 鼠标事件
   */
  scroll = event => {
    const { list } = this.props;

    /**
     * 是否正在滑动
     */
    if (this.animate) {
      return false;
    }

    event = eventHandle.getEvent(event);
    const wheelData = eventHandle.getWheelDelta(event);

    /**
     * e.wheelDelta为负数时向下滑动，否则向上滑
     */
    if (wheelData < 0 || Object.is(wheelData, -0)) {
      if (this.current >= list.length - 1) {
        return false;
      }
      this.animate = true;
      this.pageInfo(this.current + 1);
      setTimeout(() => {
        this.animate = false;
      }, 1000);
    } else {
      if (this.current <= 0) {
        return false;
      }
      this.animate = true;
      this.pageInfo(this.current - 1);
      setTimeout(() => {
        this.animate = false;
      }, 1000);
    }
  };

  getHeight(current) {
    const { list, offsetheight } = this.state;
    let height = 0;
    list.forEach((item, index) => {
      if (index < current && !item.autoHeight && !list[index + 1].autoHeight) {
        height += offsetheight;
      } else if (index < current && item.autoHeight) {
        const v = item.ref.current || {};

        height += v.offsetHeight || 0;
      } else if (index < current && index + 1 === current && list[index + 1].autoHeight) {
        const v = list[index + 1].ref.current || {};
        height += v.offsetHeight || 0;
      }
    });
    return height + 'px';
  }

  render() {
    const { list, pageScrollHeight } = this.state;
    const { isMobile, sectionClassName, className, currentClassName } = this.props;
    let pages = list.map((item, index) => (
      <div
        key={index}
        className={`${styles.section} ${sectionClassName} ${item.autoHeight ? styles.autoHeight : ''} ${
          this.current == index ? currentClassName : ''
        }`}
        style={{ height: item.autoHeight ? '' : this.state.offsetheight + 'px' }}
        ref={item.ref}
      >
        {item.content}
      </div>
    ));
    let dotList = list.map((i, index) => {
      return (
        <div
          key={'dot' + index}
          className={this.current == index ? styles.active : ''}
          onClick={e => {
            this.pageInfo(index);
          }}
        />
      );
    });
    return (
      <div className={`${styles.wrap} ${className || ''} ${isMobile ? styles.mobile : ''}`}>
        <div className={styles.container} style={{ transform: 'translate3d(0px,-' + pageScrollHeight + ', 0px)' }}>
          {pages}
        </div>
        <div className={styles.fixedList}>{dotList}</div>
      </div>
    );
  }
}
