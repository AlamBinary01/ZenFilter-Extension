import React, { useState } from "react";
import './feedback.css';
export default function Feedback() {
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [comment, setComment] = useState("");
    const [statusMessage, setStatusMessage] = useState(""); 
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handleCategoryChange = (event) => setCategory(event.target.value);
    const handleCommentChange = (event) => setComment(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatusMessage("");
    
        try {
            const response = await fetch('http://localhost:5000/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: email,
                    category: category,
                    comment: comment
                })
            });
    
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to submit feedback');
            }
    
            setEmail('');
            setCategory('');
            setComment('');
            setStatusMessage("Feedback submitted successfully!");
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatusMessage(`Failed to submit feedback: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    
    return (
        <div className="feedback-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-header">
                        <img src="/images/blacktxt.png" alt="Logo" className="logo"/>
                        <h2 className="form-title">Your feedback</h2>
                    </div>
                    <p className="instruction">We would like your feedback to improve our website.</p>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            placeholder="Your email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="category">Feedback Category:</label>
                        <select
                            id="category"
                            className="input-field"
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select category</option>
                            <option value="Very Bad">Very Bad</option>
                            <option value="Bad">Bad</option>
                            <option value="Good">Good</option>
                            <option value="Excellent">Excellent</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="comment">Comment:</label>
                        <textarea
                            id="comment"
                            className="input-field"
                            rows="4"
                            placeholder="Please leave your feedback here"
                            value={comment}
                            onChange={handleCommentChange}
                        ></textarea>
                    </div>
                    <div className="submit-container">
                        <small className="powered-by">Powered by ZenFilter</small>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            Send Feedback
                        </button>
                    </div>
                    {statusMessage && (
                        <div className="status-message">
                            {statusMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
