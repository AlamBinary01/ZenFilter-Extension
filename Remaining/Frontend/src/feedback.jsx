import React, { useState } from "react";

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
            const response = await fetch('/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    category: category,
                    comment: comment
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to submit feedback: ${response.statusText}`);
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
        <div className="max-w-sm mx-auto bg-white p-4 shadow-lg">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-2 mb-4">
                    <img src="https://placehold.co/40x40" alt="Logo" className="h-8 w-8" />
                    <h2 className="text-lg font-bold">Your feedback</h2>
                </div>
                <p className="mb-4 text-sm">We would like your feedback to improve our website.</p>
                <p className="mb-2 font-semibold">Please enter your email:</p>
                <input
                    type="email"
                    className="w-full p-2 border border-zinc-300 rounded-lg mb-4 focus:outline-none"
                    placeholder="Your email"
                    value={email}
                    onChange={handleEmailChange}
                />
                <p className="mb-2 font-semibold">Please select your feedback category below:</p>
                <select
                    className="w-full p-2 border border-zinc-300 rounded-lg mb-4 focus:outline-none"
                    value={category}
                    onChange={handleCategoryChange}
                >
                    <option value="">Select category</option>
                    <option value="Bad">Bad</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Outstanding">Outstanding</option>
                </select>
                <p className="mb-2 font-semibold">Please leave your feedback below:</p>
                <textarea
                    className="w-full p-2 border border-zinc-300 rounded-lg mb-4 focus:outline-none"
                    rows="4"
                    placeholder="I cannot find the contact page"
                    value={comment}
                    onChange={handleCommentChange}
                ></textarea>

                <div className="flex justify-between items-center">
                    <small className="text-zinc-600">Powered by ZenFilter</small>
                    <button
                        type="submit"
                        className="bg-red-500 text-white p-2 rounded-lg focus:outline-none"
                        disabled={isSubmitting}
                    >
                        Send
                    </button>
                </div>
                {statusMessage && (
                    <div className="mt-4 text-center text-sm font-semibold">
                        {statusMessage}
                    </div>
                )}
            </form>
        </div>
    );
}
