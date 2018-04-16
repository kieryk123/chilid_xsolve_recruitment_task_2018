import React, { Component } from 'react';
import Pagination from './Pagination';

const months = [
	'styczeń',
	'luty',
	'marzec',
	'kwiecień',
	'maj',
	'czerwiec',
	'lipiec',
	'sierpień',
	'wrzesień',
	'pazdziernik',
	'listopad',
	'grudzień'
];

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			pagesTotal: null,
			tableRows: null,
			rowsPerPage: null,
			currentPage: 0
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			tableRows: nextProps.data.length,
			rowsPerPage: nextProps.rowsPerPage
		}
	}

	componentDidMount() {
		this.divideDataToPages();
	}

	divideDataToPages = (data = this.props.data) => {
		const {tableRows, rowsPerPage} = this.state;
		const pagesTotal = Math.ceil(tableRows / rowsPerPage);

		let dividedData = [];

		for (let i = 0; i < pagesTotal; i++) {
		  dividedData.push(data.slice(i * rowsPerPage, (i + 1) * rowsPerPage));
		}

		this.setState({
			data: dividedData,
			pagesTotal: pagesTotal
		});
	}

	changePage = (page) => {
		const {currentPage, pagesTotal} = this.state;

		if (page === 'back') {
			(currentPage !== 0) ? this.setState({ currentPage: currentPage - 1 }) : null;
		} else if (page === 'next') {
			(currentPage !== pagesTotal-1) ? this.setState({ currentPage: currentPage + 1 }) : null;
		} else if (typeof page === 'number') {
			this.setState({ currentPage: page });
		}
	}

	// handle click on table header
	handleSort = (e) => {
		const {currentPage} = this.state;
		const target = e.target;
		const dataName = target.getAttribute('data-name');
		const order = target.getAttribute('data-order');

		if (currentPage > 0) {
			this.setState({ currentPage: 0 });
		}

		this.sortData(order, target, dataName);
	}

	// check what to sort and in which order
	checkSort = (a, b, dataType, order, target, dataName) => {
		switch (dataType) {
			case 'number':

				switch (order) {
					case 'asc':
						target.setAttribute('data-order', 'desc');

						if (dataName === 'id') {
							if (a.id > b.id) {
								return 1;
							}
							if (a.id < b.id) {
								return -1;
							}
							return 0;
						} else if (dataName === 'note') {
							if (a.note > b.note) {
								return 1;
							}
							if (a.note < b.note) {
								return -1;
							}
							return 0;
						}
						break;

					case 'desc':
						target.setAttribute('data-order', 'asc');

						if (dataName === 'id') {
							if (a.id < b.id) {
								return 1;
							}
							if (a.id > b.id) {
								return -1;
							}
							return 0;
						} else if (dataName === 'note') {
							if (a.note < b.note) {
								return 1;
							}
							if (a.note > b.note) {
								return -1;
							}
							return 0;
						}
						break;

					default:
						break;
				}
				break;

			case 'string':
				switch (order) {
					case 'asc':
						target.setAttribute('data-order', 'desc');

						if (dataName === 'firstName') {
							if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
								return 1;
							}
							if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
								return -1;
							}
							return 0;
						} else if (dataName === 'lastName') {
							if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
								return 1;
							}
							if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
								return -1;
							}
							return 0;
						} else if (dataName === 'company') {
							if (a.company.toLowerCase() > b.company.toLowerCase()) {
								return 1;
							}
							if (a.company.toLowerCase() < b.company.toLowerCase()) {
								return -1;
							}
							return 0;
						}
						break;

					case 'desc':
						target.setAttribute('data-order', 'asc');

						if (dataName === 'firstName') {
							if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
								return 1;
							}
							if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
								return -1;
							}
							return 0;
						} else if (dataName === 'lastName') {
							if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
								return 1;
							}
							if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
								return -1;
							}
							return 0;
						} else if (dataName === 'company') {
							if (a.company.toLowerCase() < b.company.toLowerCase()) {
								return 1;
							}
							if (a.company.toLowerCase() > b.company.toLowerCase()) {
								return -1;
							}
							return 0;
						}
						break;

					default:
						break;
				}
				break;

			case 'date':
				switch (order) {
					case 'asc':
						target.setAttribute('data-order', 'desc');

						if (a.dateOfBirth > b.dateOfBirth) {
							return 1;
						}
						if (a.dateOfBirth < b.dateOfBirth) {
							return -1;
						}
						return 0;

					case 'desc':
						target.setAttribute('data-order', 'asc');

						if (a.dateOfBirth < b.dateOfBirth) {
							return 1;
						}
						if (a.dateOfBirth > b.dateOfBirth) {
							return -1;
						}
						return 0;

					default:
						break;
				}
				break;

			default:
				break;
		}
	}

	// sort data finally and invoke this.divideDataToPages() which updates state
	sortData = (order, target, dataName) => {
		let tableData = this.state.data;
		let sortedData = [];

		// combine divided data to one array
		tableData = [].concat.apply([], tableData);

		const dataType = target.getAttribute('data-datatype');

		sortedData = tableData.sort((a, b) => {
			return this.checkSort(a, b, dataType, order, target, dataName);
		});

		this.divideDataToPages(sortedData);
	}

	formatDate = (date) => {
		const day = date.getDate();
		const month = months[date.getMonth() - 1];
		const year = date.getFullYear();

		const fullDate = `${day} ${month} ${year}`;

		return fullDate;
	}

  render() {
		let tableData = this.state.data;
		let currentPage = this.state.currentPage;

		// check if tableData not empty or undefined (wait for state update)
		if (tableData[0] !== undefined) {
			tableData = tableData[currentPage].map((item, index) => {
				return (
					<tr className="c-table__row" key={index}>
						<td className="c-table__dataCell" data-th="ID">{item.id}</td>
						<td className="c-table__dataCell" data-th="First name">{item.firstName}</td>
						<td className="c-table__dataCell" data-th="Last name">{item.lastName}</td>
						<td className="c-table__dataCell" data-th="Birth date">{this.formatDate(item.dateOfBirth)}</td>
						<td className="c-table__dataCell" data-th="Company">{item.company}</td>
						<td className="c-table__dataCell" data-th="Note">{item.note}</td>
					</tr>
				)
			});
		}

    return (
			<div>
	      <table className="c-table">
	        <thead className="c-table__head">
						<tr className="c-table__row">
		          <th className="c-table__headerCell">
								<span
									data-name="id"
									data-datatype="number"
									data-order="desc"
									onClick={this.handleSort}
								>ID</span>
							</th>

		          <th className="c-table__headerCell">
								<span
									data-name="firstName"
									data-datatype="string"
									data-order="asc"
									onClick={this.handleSort}
								>First name</span>
							</th>

		          <th className="c-table__headerCell">
								<span
									data-name="lastName"
									data-datatype="string"
									data-order="asc"
									onClick={this.handleSort}
								>Last name</span>
							</th>

		          <th className="c-table__headerCell">
								<span
									data-name="dateOfBirth"
									data-datatype="date"
									data-order="asc"
									onClick={this.handleSort}
								>Birth date</span>
							</th>

		          <th className="c-table__headerCell">
								<span
									data-name="company"
									data-datatype="string"
									data-order="asc"
									onClick={this.handleSort}
								>Company</span>
							</th>

		          <th className="c-table__headerCell">
								<span
									data-name="note"
									data-datatype="number"
									data-order="asc"
									onClick={this.handleSort}
								>Note</span>
							</th>
						</tr>
	        </thead>

					<tbody className="c-table__body">
						{tableData}
					</tbody>
	      </table>

				<Pagination
					pagesTotal={this.state.pagesTotal}
					currentPage={this.state.currentPage}
					changePage={this.changePage}
				/>
			</div>
    );
  }
}

export default Table;
