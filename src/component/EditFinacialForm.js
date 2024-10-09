import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 1.5rem auto;
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #4a5568;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Textarea = styled.textarea`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Select = styled.select`
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem;
  color: #4a5568;
  background-color: #f7fafc;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2b6cb0;
  }
`;

const EditTransactionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction } = location.state || {};

  const [amount, setAmount] = useState(transaction.amount);
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category);
  const [status, setStatus] = useState(transaction.status);
  // const [imageUrl, setImageUrl] = useState(transaction.imageUrl || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedTransaction = {
      amount,
      date,
      description,
      category,
      status,
      // imageUrl,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/financialEntries/${transaction.id}`,
        updatedTransaction
      );

      if (response.status === 200) {
        toast.success("Transaction updated successfully!");
        navigate(`/`, {
          state: { transaction: { ...transaction, ...updatedTransaction } },
        });
      } else {
        toast.error("Failed to update transaction. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Edit Transaction</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="amount">Amount:</Label>
          <Input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date:</Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description:</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category">Category:</Label>
          <Select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Groceries">Groceries</option>
            <option value="Utilities">Utilities</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status:</Label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </Select>
        </div>
        {/* <div>
          <Label htmlFor="imageUrl">Image URL:</Label>
          <Input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div> */}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Transaction"}
        </Button>
      </Form>
    </Container>
  );
};

export default EditTransactionForm;
