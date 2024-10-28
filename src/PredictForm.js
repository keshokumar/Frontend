import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [inputText, setInputText] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [probability, setProbability] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // State to hold error message

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null); // Reset error message before each submit

        try {
            const response = await fetch('https://fake-news-detection-zfac.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            // Check if the response is ok, else log the status
            if (!response.ok) {
                const errorData = await response.json(); // Attempt to get error response
                console.error('Error response:', errorData);
                throw new Error('Network response was not ok: ' + response.status);
            }

            const data = await response.json();
            setPrediction(data.prediction);
            setProbability(data.probability);
        } catch (error) {
            console.error("Error fetching prediction:", error);
            setErrorMessage("Failed to get prediction. Please try again."); // Set error message
            setPrediction(null);
            setProbability(null);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="app-title">FAKE NEWS DETECTION</h1>
                <p className="info-text">
                    Distinguishing between true and false information is crucial. Enter news text to check its authenticity.
                </p>
                <form onSubmit={handleSubmit} className="input-form">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter news text here"
                        rows="4"
                        className="form-control"
                        required
                    ></textarea>
                    <button type="submit" className="btn btn-primary submit-button">Submit</button>
                </form>
                {errorMessage && ( // Display error message if it exists
                    <div className="alert alert-danger result-alert">
                        {errorMessage}
                    </div>
                )}
                {prediction !== null && (
                    <div className="alert alert-info result-alert">
                        {prediction === 1 ? 'The news is likely TRUE!' : 'The news is likely FAKE!'}
                        <br />
                        Probability: {probability !== null ? probability.toFixed(2) : 'N/A'}
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
