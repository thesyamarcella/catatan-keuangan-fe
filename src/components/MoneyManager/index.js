import { Component } from "react";
import { v4 } from "uuid";
import axios from "axios";
import TransactionItem from "../TransactionItem";
import MoneyDetails from "../MoneyDetails";
import "./index.css";

const transactionTypeOptions = [
  {
    optionId: "pemasukan",
    displayText: "pemasukan",
  },
  {
    optionId: "pengeluaran",
    displayText: "pengeluaran",
  },
];

const API_BASE_URL = "http://127.0.0.1:8000/api";

class MoneyManager extends Component {
  state = {
    transactionsList: [],
    titleInput: "",
    amountInput: "",
    optionId: transactionTypeOptions[0].optionId,
    totalSaldo: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
  };

  componentDidMount() {
    this.fetchTransactions();
    this.fetchTotalSaldo();
  }

  fetchTransactions() {
    axios
      .get(`${API_BASE_URL}/transaksi`)
      .then((response) => {
        this.setState({ transactionsList: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addTransaction = (newTransaction) => {
    axios
      .post(`${API_BASE_URL}/transaksi`, newTransaction)
      .then((response) => {
        this.setState((prevState) => ({
          transactionsList: [...prevState.transactionsList, response.data],
          titleInput: "",
          amountInput: "",
          optionId: transactionTypeOptions[0].optionId,
        }));
        this.fetchTotalSaldo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  updateTransaction = (id, updatedTransaction) => {
    axios
      .put(`${API_BASE_URL}/transaksi/${id}`, updatedTransaction)
      .then((response) => {
        const updatedTransactionsList = this.state.transactionsList.map(
          (transaction) =>
            transaction.id === id ? response.data : transaction
        );
        this.setState({
          transactionsList: updatedTransactionsList,
        });
        this.fetchTotalSaldo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteTransaction = (id) => {
    axios
      .delete(`${API_BASE_URL}/transaksi/${id}`)
      .then(() => {
        const updatedTransactionsList = this.state.transactionsList.filter(
          (transaction) => transaction.id !== id
        );
        this.setState({
          transactionsList: updatedTransactionsList,
        });
        this.fetchTotalSaldo();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fetchTotalSaldo() {
    axios
      .get(`${API_BASE_URL}/saldo`)
      .then((response) => {
        this.setState({
          totalSaldo: response.data.totalSaldo,
          totalPemasukan: response.data.totalPemasukan,
          totalPengeluaran: response.data.totalPengeluaran,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getExpenses = () => {
    const { transactionsList } = this.state;
    let expensesAmount = 0;

    transactionsList.forEach((eachTransaction) => {
      if (eachTransaction.type === transactionTypeOptions[1].displayText) {
        expensesAmount += eachTransaction.amount;
      }
    });

    return expensesAmount;
  };

  getIncome = () => {
    const { transactionsList } = this.state;
    let incomeAmount = 0;
    transactionsList.forEach((eachTransaction) => {
      if (eachTransaction.type === transactionTypeOptions[0].displayText) {
        incomeAmount += eachTransaction.amount;
      }
    });

    return incomeAmount;
  };

  getBalance = () => {
    const { transactionsList } = this.state;
    let balanceAmount = 0;
    let incomeAmount = 0;
    let expensesAmount = 0;

    transactionsList.forEach((eachTransaction) => {
      if (eachTransaction.type === transactionTypeOptions[0].displayText) {
        incomeAmount += eachTransaction.amount;
      } else {
        expensesAmount += eachTransaction.amount;
      }
    });

    balanceAmount = incomeAmount - expensesAmount;

    return balanceAmount;
  };

  onChangeOptionId = (event) => {
    this.setState({ optionId: event.target.value });
  };

  onChangeAmountInput = (event) => {
    this.setState({ amountInput: event.target.value });
  };

  onChangeTitleInput = (event) => {
    this.setState({ titleInput: event.target.value });
  };

  onAddTransaction = (event) => {
    event.preventDefault();
    const { titleInput, amountInput, optionId } = this.state;
    const typeOption = transactionTypeOptions.find(
      (eachTransaction) => eachTransaction.optionId === optionId
    );
    const { displayText } = typeOption;
    const newTransaction = {
      id: v4(),
      title: titleInput,
      amount: parseInt(amountInput),
      type: displayText,
    };

    this.addTransaction(newTransaction);
  };
  

  render() {
    const { titleInput, amountInput, optionId, transactionsList } = this.state;
    const balanceAmount = this.getBalance();
    const incomeAmount = this.getIncome();
    const expensesAmount = this.getExpenses();

    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="header-container">
            <h1 className="heading">Hi, Fauzan</h1>
            <p className="header-content">
              Selamat Datang di Catatan Keuangan!
              <span className="money-manager-text"> Catatan Keuangan</span>
            </p>
          </div>
          <MoneyDetails
            balanceAmount={balanceAmount}
            incomeAmount={incomeAmount}
            expensesAmount={expensesAmount}
          />
          <div className="transaction-details">
            <form className="transaction-form" onSubmit={this.onAddTransaction}>
              <h1 className="transaction-header">Tambah Transaksi</h1>
              <label className="input-label" htmlFor="title">
                NAMA TRANSAKSI
              </label>
              <input
                type="text"
                id="title"
                value={titleInput}
                onChange={this.onChangeTitleInput}
                className="input"
                placeholder="Nama Transaksi"
              />
              <label className="input-label" htmlFor="amount">
                JUMLAH
              </label>
              <input
                type="text"
                id="amount"
                className="input"
                value={amountInput}
                onChange={this.onChangeAmountInput}
                placeholder="Jumlah"
              />
              <label className="input-label" htmlFor="select">
                TIPE
              </label>
              <select
                id="select"
                className="input"
                value={optionId}
                onChange={this.onChangeOptionId}
              >
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>

              <button type="submit" className="button">
                Add
              </button>
            </form>
            <div className="history-transactions">
              <h1 className="transaction-header">History</h1>
              <div className="transactions-table-container">
                <ul className="transactions-table">
                  <li className="table-header">
                    <p className="table-header-cell">Nama Transaksi</p>
                    <p className="table-header-cell">Jumlah</p>
                    <p className="table-header-cell">Tipe</p>
                  </li>
                  {transactionsList.map(eachTransaction => (
                    <TransactionItem
                      key={eachTransaction.id}
                      transactionDetails={eachTransaction}
                      deleteTransaction={this.deleteTransaction}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MoneyManager;
