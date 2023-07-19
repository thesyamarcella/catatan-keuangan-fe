import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const MoneyDetails = (props) => {
  const { balanceAmount, incomeAmount, expensesAmount } = props;
  const [totalSaldo, setTotalSaldo] = useState(0);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);

  useEffect(() => {
    fetchTotalSaldo();
  }, []);

  const fetchTotalSaldo = () => {
    axios
      .get(`${API_BASE_URL}/saldo`)
      .then((response) => {
        setTotalSaldo(response.data.totalSaldo);
        setTotalPemasukan(response.data.totalPemasukan);
        setTotalPengeluaran(response.data.totalPengeluaran);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="money-details-container">
      <div className="balance-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/balance-image.png"
          alt="balance"
          className="details-img"
        />
        <div>
          <p className="details-text">Saldo Anda</p>
          <p className="details-money" testid="balanceAmount">
            Rp {balanceAmount}
          </p>
        </div>
      </div>
      <div className="income-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/income-image.png"
          alt="income"
          className="details-img"
        />
        <div>
          <p className="details-text">Pemasukkan Anda</p>
          <p className="details-money" testid="incomeAmount">
            Rp {incomeAmount}
          </p>
        </div>
      </div>
      <div className="expenses-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/expenses-image.png"
          alt="expenses"
          className="details-img"
        />
        <div>
          <p className="details-text">Pengeluaran Anda</p>
          <p className="details-money" testid="expensesAmount">
            Rp {expensesAmount}
          </p>
        </div>
      </div>
    </div>
  )
};

export default MoneyDetails;
