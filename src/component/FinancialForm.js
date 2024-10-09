import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 640px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #4a5568;
`;

const Input = styled.input`
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background-color: #f7fafc;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const TextArea = styled.textarea`
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background-color: #f7fafc;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Select = styled.select`
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
  background-color: #f7fafc;
  color: #4a5568;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #4299e1;
  color: white;
  font-weight: bold;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #3182ce;
  }
`;

// const ImagePreview = styled.img`
//   max-width: 100%;
//   height: auto;
//   margin-top: 1rem;
// `;


export default function FinancialForm() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  // const [imageUrl, setImageUrl] = useState("");

  const [transactions, setTransactions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0 || !description || !date || !category || !paymentMethod || !status) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    const newFinancialEntry = {
      amount: Number(amount),
      description,
      date,
      category,
      paymentMethod,
      notes,
      status,
      // imageUrl,
    };

    try {
      const response = await axios.post("http://localhost:4000/financialEntries", newFinancialEntry);
      if (response.status === 201) {
        toast.success("Financial entry created successfully!");
        setTransactions([...transactions, newFinancialEntry]);
        resetForm();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create financial entry.");
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setDate("");
    setCategory("");
    setPaymentMethod("");
    setNotes("");
    setStatus("");
    // setImageUrl("");
  };
  


  return (
    <Container>
      <Title>Create a New Financial Entry</Title>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount:</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date:</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <Select
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a payment method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status:</label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select a status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Notes:</label>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image URL:</label>
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && <ImagePreview src={imageUrl} alt="Preview" />}
        </div> */}

        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
}
