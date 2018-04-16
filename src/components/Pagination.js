import React, { Component } from 'react';

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagesTotal: null,
      currentPage: null
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      pagesTotal: nextProps.pagesTotal,
      currentPage: nextProps.currentPage
    }
  }

  handleChangePage = page => this.props.changePage(page);

  render() {
    const {pagesTotal, currentPage} = this.state;
    let pages = [];

    for (var i = 0; i < pagesTotal; i++) {
      pages.push(i);
    }

    pages = pages.map((item, index) => {
      if (index === currentPage) {
        return (
          <li
            onClick={() => this.handleChangePage(index)}
            key={index}
            className="c-pagination__item c-pagination__item--active"
          >{index + 1}</li>
        )
      } else {
        return (
          <li
            onClick={() => this.handleChangePage(index)}
            key={index}
            className="c-pagination__item"
          >{index + 1}</li>
        )
      }

    });

    return (
      <ul className="c-pagination">
        <li onClick={() => this.handleChangePage('back')} className="c-pagination__item c-pagination__item--back">&#60; back</li>
        {pages}
        <li onClick={() => this.handleChangePage('next')} className="c-pagination__item c-pagination__item--next">next &#62;</li>
      </ul>
    );
  }
}

export default Pagination;
