import React from 'react';
export default function Widget() {
    return (
        <div className="max-w-sm mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6 0H7"></path></svg>
            </div>
            <h2 className="text-center text-2xl font-bold text-zinc-900">Welcome!</h2>
            <p className="text-center text-sm text-zinc-500">Sign in to your account</p>
            <form className="mt-6">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
                    <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-2 bg-white border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded" checked />
                        <span className="ml-2 text-sm text-zinc-600">Remember me?</span>
                    </label>
                    <a href="#" className="text-sm text-blue-500 hover:text-blue-700">Forgot password?</a>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Login →
                </button>
            </form>
        </div>
    )
}
