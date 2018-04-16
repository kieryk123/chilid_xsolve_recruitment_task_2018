import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Table from './components/Table';
import Loader from './components/Loader';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tableData: 0
    }
  }

  componentDidMount() {
		this.callAPI('https://api.myjson.com/bins/1bgvtn');
	}

  init = (data) => {
    let tableData = this.stringToDate(data);

    tableData = tableData.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
    	return 0;
    });

    this.setState({ tableData: tableData });
  }

  stringToDate = (data) => {
    let newData = [];

    data.forEach(data => {
      let dateOfBirth = data.dateOfBirth;
      dateOfBirth = dateOfBirth.split(' ')[0];

  		let month = Number(dateOfBirth.split('.')[1]);
  		const day = dateOfBirth.split('.')[0];
  		const year = dateOfBirth.split('.')[2];

  		const newDateOfBirth = new Date(year, month, day);

      newData.push({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: newDateOfBirth,
        company: data.company,
        note: data.note
      });
    });

    return newData;
  }

  callAPI = (url = 'https://api.myjson.com/bins/1bgvtn') => {
    fetch(url)
			.then(data => data.json())
			.then(data => { this.init(data) })
      .catch(error => { alert(error) })
  }

  render() {
    return (
      <div>
        <Header />
        {this.state.tableData ? <Table data={this.state.tableData} rowsPerPage={5} /> : <Loader />}
        <Footer />
      </div>
    );
  }
}

export default App;
