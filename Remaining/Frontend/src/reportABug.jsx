import React from "react";

export default function Widget() {
    return (
        <div className="bg-white p-8 font-sans">
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                    <span>🐛</span>
                    <span>Bug report form</span>
                </h1>
                <p className="mb-4">Use this form to report any bugs or issues you encounter.</p>
                <form action="#" method="POST">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">Your email *</label>
                        <input type="email" id="email" className="border border-zinc-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm w-full" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-semibold mb-2">Brief description of the issue</label>
                        <textarea id="description" rows="3" className="border border-zinc-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm w-full"></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="severity" className="block text-sm font-semibold mb-2">Severity of the issue</label>
                        <select id="severity" className="border border-zinc-300 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm w-full">
                            <option selected disabled>Choose severity</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Screenshot of the issue</label>
                        <div className="border border-dashed border-zinc-300 rounded-md p-4 text-center">
                            <input type="file" className="w-full text-sm text-zinc-700 hover:bg-green-100 rounded-full px-4 py-2 border-0 font-semibold" />
                        </div>
                    </div>
                    
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md w-full">
                        Report bug
                    </button>
                </form>
            </div>
        </div>
    );
}
