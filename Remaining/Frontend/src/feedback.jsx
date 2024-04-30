import React from "react";

export default function Feedback() {
    return (
        <div className="max-w-sm mx-auto bg-white p-4 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
                <img src="https://placehold.co/40x40" alt="Logo" className="h-8 w-8" />
                <h2 className="text-lg font-bold">Your feedback</h2>
            </div>
            <p className="mb-4 text-sm">We would like your feedback to improve our website.</p>
            
            <p className="mb-2 font-semibold">Please select your feedback category below:</p>
            <div className="flex gap-2 mb-4">
                <span></span> <span></span> <span></span>
                <button className="bg-zinc-200 text-black p-2 rounded-lg focus:outline-none">Bad</button>
                <button className="bg-zinc-200 text-black p-2 rounded-lg focus:outline-none">Good</button>
                <button className="bg-zinc-200 text-black p-2 rounded-lg focus:outline-none">Excellent</button>
                <button className="bg-zinc-200 text-black p-2 rounded-lg focus:outline-none">Outstanding</button>
            </div>
            <p className="mb-2 font-semibold">Please leave your feedback below:</p>
            <textarea className="w-full p-2 border border-zinc-300 rounded-lg mb-4 focus:outline-none" rows="4" placeholder="I cannot find the contact page"></textarea>
            <div className="flex justify-between items-center">
                <small className="text-zinc-600">Powered by ZenFilter</small>
                <button className="bg-red-500 text-white p-2 rounded-lg focus:outline-none">Send</button>
            </div>
        </div>
    );
}
