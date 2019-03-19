import React, { Component, Fragment } from 'react';
import Full from '@/components/Full';
import styles from './index.scss';

const pages = [
  {
    key: 'page1',
    autoHeight: true,
    title: 'page1 title1',
    text: 'text1 text1 text1 text1 text1 text1'
  },
  {
    key: 'page2',
    title: 'page2 title2',
    text: 'text2 text2 text2 text2 text2 text2'
  },
  {
    key: 'page3',
    title: 'page3 title3',
    text: 'text3 text3 text3 text3 text3 text3'
  },
  {
    key: 'page4',
    title: 'page4 title4',
    text: 'text4 text4 text4 text4 text4 text4'
  },
  {
    key: 'page5',
    autoHeight: true,
    title: 'page5 title5',
    text: 'text5 text5 text5 text5 text5 text5'
  }
];
const list = pages.map((item, index) => {
  return {
    key: item.key,
    // autoHeight: item.autoHeight,
    content: (
      <div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    )
  };
});

export default class Home extends Component {
  componentDidMount() {}

  render() {
    return <Full list={list} sectionClassName={styles.page} currentClassName={styles.activePage} />;
  }
}
