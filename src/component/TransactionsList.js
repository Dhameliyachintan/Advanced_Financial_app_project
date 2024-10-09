import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 1rem;
  color: #cbd5e0; 
  border-radius: 0.375rem;
  text-align: start;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const TitleText = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a5568;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const TotalSpending = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: black;
`;

const ChartContainer = styled.div`
  flex: 1;
  height: 300px;
  position: relative;
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  margin-left: 1rem;
  margin-top: 70px;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

// const FlexWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 1.5rem;
//   @media (max-width: 768px) {
//     flex-direction: column;
//   }
// `;

const SearchInput = styled.input`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  overflow: hidden;
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const TableHeader = styled.th`
  padding: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  background-color: #edf2f7;
  text-align: left;
  font-weight: bold;
  color: #4a5568;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f7fafc;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.9rem;

  &:last-child {
    display: flex;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;

  &.edit {
    background-color: #4299e1;
    &:hover {
      background-color: #3182ce;
    }
  }

  &.delete {
    background-color: #e53e3e;
    &:hover {
      background-color: #c53030;
    }
  }

  &.toggle {
    background-color: ${(props) => (props.$pending ? "#3182ce" : "#48bb78")};
    &:hover {
      background-color: ${(props) => (props.$pending ? "#2b6cb0" : "#38a169")};
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  cursor: pointer;

  &.next {
    background-color: #48bb78;
    &:hover {
      background-color: #38a169;
    }
  }

  &.prev {
    background-color: #4299e1;
    &:hover {
      background-color: #3182ce;
    }
  }

  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const TransactionsList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/financialEntries"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditClick = (transaction) => {
    navigate("/editfinacialform", { state: { transaction } });
  };

  const handleDeleteClick = async (transactionId) => {
    try {
      await axios.delete(
        `http://localhost:4000/financialEntries/${transactionId}`
      );
      fetchTransactions();
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction.");
    }
  };

  const handleTogglePending = async (transactionId) => {
    try {
      const transaction = transactions.find((t) => t.id === transactionId);
      const updatedTransaction = {
        ...transaction,
        status: transaction.status === "Pending" ? "Completed" : "Pending",
      };

      await axios.put(
        `http://localhost:4000/financialEntries/${transactionId}`,
        updatedTransaction
      );
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      (transaction.title &&
        transaction.title.toLowerCase().includes(lowerCaseTerm)) ||
      (transaction.amount &&
        transaction.amount.toString().includes(lowerCaseTerm)) ||
      (transaction.date &&
        transaction.date.toLowerCase().includes(lowerCaseTerm)) ||
      (transaction.category &&
        transaction.category.toLowerCase().includes(lowerCaseTerm)) ||
      (transaction.status &&
        transaction.status.toLowerCase().includes(lowerCaseTerm))
    );
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const totalSpending = filteredTransactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const categories = [...new Set(filteredTransactions.map((t) => t.category))];
  const categoryData = categories.map((category) =>
    filteredTransactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Spending by Category",
        data: categoryData,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Container>
      <TitleText>Transactions List</TitleText>

      {/* <FlexWrapper> */}
        <ChartContainer>
          <TotalSpending>
            Total Spending: ${totalSpending.toFixed(2)}
          </TotalSpending>
          <Pie data={chartData} options={chartOptions} />
        </ChartContainer>

        <TableContainer>
          <div>
            <label
              htmlFor="search"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Search transactions by title, amount, date, category, or status:
            </label>
            <SearchInput
              id="search"
              type="text"
              placeholder="Enter search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Table>
            <thead>
              <tr>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    $
                    {isNaN(transaction.amount)
                      ? "0.00"
                      : parseFloat(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <ActionButton
                      className="toggle"
                      $pending={transaction.status === "Pending"}
                      onClick={() => handleTogglePending(transaction.id)}
                    >
                      {transaction.status === "Pending"
                        ? "Complete"
                        : "Pending"}
                    </ActionButton>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <ActionButton
                      className="edit"
                      onClick={() => handleEditClick(transaction)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      className="delete"
                      onClick={() => handleDeleteClick(transaction.id)}
                    >
                      Delete
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <PaginationContainer>
            <PaginationButton
              className="prev"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton
              className="next"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </PaginationContainer>
        </TableContainer>
      {/* </FlexWrapper> */}
      <ToastContainer />
    </Container>
  );
};

export default TransactionsList;
