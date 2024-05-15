import React, { useState } from "react";
import "./ReportBug.css"; 
export default function ReportBug() {
    const [formData, setFormData] = useState({
        email: "",
        description: "",
        severity: "",
        screenshot: "" 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Retrieve token from local storage
        const token = window.localStorage.getItem("token");
    
        if (!token) {
            alert("No authentication token found. Please log in again.");
            return;
        }
    
        const response = await fetch('http://localhost:5000/reportBug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
            body: JSON.stringify(formData)
        });
    
        const responseData = await response.json();
        if (response.ok) {
            alert('Bug report submitted successfully!');
        } else {
            alert(`Failed to submit bug report: ${responseData.error}`);
        }
    };
    

    return (
        <div className="report-bug-container">
            <div className="content">
                <h1 className="header">
                    <span role="img" aria-label="bug">🐛</span>
                    Bug Report Form
                </h1>
                <p>Use this form to report any bugs or issues you encounter.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Your Email *</label>
                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Brief Description of the Issue</label>
                        <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="severity">Severity of the Issue</label>
                        <select id="severity" name="severity" value={formData.severity} onChange={handleChange}>
                            <option value="">Choose Severity</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Screenshot of the Issue</label>
                        <div className="file-input">
                            <input type="file" name="screenshot" onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">Report Bug</button>
                </form>
            </div>
        </div>
    );
}
