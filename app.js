import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

function App() {
  // State for JSON input, API response, selected options, and error
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Options for the multi-select dropdown
  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
  ];

  // Handle JSON input change
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError(''); // Clear error on input change
  };

  // Validate and parse JSON
  const validateJson = (input) => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Invalid JSON format: "data" must be an array');
      }
      return parsed;
    } catch (error) {
      throw new Error('Invalid JSON format: ' + error.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = validateJson(jsonInput);
      const backendUrl = 'https://bfhl-api.vercel.app/bfhl'; // Replace with your deployed backend URL
      const res = await axios.post(backendUrl, parsedJson);
      setResponse(res.data);
      setError('');
      setSelectedOptions([]); // Reset dropdown selection on new submission
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  // Handle dropdown selection
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected ? selected.map(option => option.value) : []);
  };

  // Filter response based on selected options
  const getFilteredResponse = () => {
    if (!response) return null;

    const filtered = {};
    if (selectedOptions.includes('numbers') && response.numbers) {
      filtered.numbers = response.numbers;
    }
    if (selectedOptions.includes('alphabets') && response.alphabets) {
      filtered.alphabets = response.alphabets;
    }
    if (selectedOptions.includes('highest_alphabet') && response.highest_alphabet) {
      filtered.highest_alphabet = response.highest_alphabet;
    }
    return filtered;
  };

  return (
    <div className="App">
      <h1>ABCD123</h1> {/* Replace with your roll number */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON (e.g., {"data": ["A","C","z"]})'
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <>
          <h2>Response</h2>
          <Select
            options={options}
            isMulti
            onChange={handleSelectChange}
            placeholder="Select fields to display..."
          />
          <pre>{JSON.stringify(getFilteredResponse(), null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
