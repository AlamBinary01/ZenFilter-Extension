import React from "react";

export default function ReportBug() {
    return (
        <div className="bg-white p-8 font-sans">
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                    <span role="img" aria-label="bug">🐛</span>
                    <span>Bug Report Form</span>
                </h1>
                <p className="mb-6">Use this form to report any bugs or issues you encounter.</p>
                <form action="#" method="POST">
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">Your Email *</label>
                        <input type="email" id="email" className="border border-zinc-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm w-full" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-semibold mb-2">Brief Description of the Issue</label>
                        <textarea id="description" rows="4" className="border border-zinc-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm w-full"></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="severity" className="block text-sm font-semibold mb-2">Severity of the Issue</label>
                        <select id="severity" className="border border-zinc-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm w-full">
                            <option disabled>Choose Severity</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">Screenshot of the Issue</label>
                        <div className="border border-dashed border-zinc-300 rounded-md p-4 text-center">
                            <input type="file" className="w-full text-sm text-zinc-700 hover:bg-green-100 rounded-full px-4 py-2 border-0 font-semibold" />
                        </div>
                    </div>
                    
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md w-full transition-colors duration-150">
                        Report Bug
                    </button>
                </form>
            </div>
        </div>
    );
}
