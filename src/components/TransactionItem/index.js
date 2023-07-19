import axios from "axios";
import "./index.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const TransactionItem = (props) => {
  const { transactionDetails, deleteTransaction } = props;
  const { id, title, amount, type } = transactionDetails;

  const onDeleteTransaction = () => {
    deleteTransaction(id);
  };

  return (
    <li className="table-row">
      <p className="transaction-text">{title}</p>
      <p className="transaction-text">Rp {amount}</p>
      <p className="transaction-text">{type}</p>
      <div className="delete-container">
        <button
          className="delete-button"
          type="button"
          onClick={onDeleteTransaction}
          testid="delete"
        >
          <img
            className="delete-img"
            src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
            alt="delete"
          />
        </button>
      </div>
    </li>
  );
};

export default TransactionItem;
