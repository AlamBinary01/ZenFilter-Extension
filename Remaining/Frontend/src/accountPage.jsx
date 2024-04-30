import React from "react";

export default function AccountPage() {
    return (
        <div className="bg-zinc-200 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-1/3 px-4 mb-4 lg:mb-0">
                        <div className="flex flex-col items-center">
                            <img src="https://placehold.co/100x100" alt="User" className="rounded-full mb-4" />
                            <h3 className="text-lg font-semibold">Haseeb Mushtaq</h3>
                            <a href="#" className="text-blue-500 text-sm">Download </a>
                            <p className="text-xs text-zinc-500 mt-2">www.zenfilter.com</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3 px-4">
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Account Settings</h2>
                        </div>
                        <form action="#" method="POST" className="space-y-4">
                        <div className="flex flex-wrap -mx-2">
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <label htmlFor="phone-number" className="block text-sm font-medium text-zinc-700">Change Name</label>
                                    <input type="tel" id="phone-number" name="phone-number" value="Haseeb Mushtaq" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
                                </div>
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-zinc-700">Email Address</label>
                                    <input type="email" id="email-address" name="email-address" value="haseeb271002@gmail.com" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
                                </div>
                            </div> <div className="flex flex-wrap -mx-2">
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <label htmlFor="phone-number" className="block text-sm font-medium text-zinc-700">New Passowrd</label>
                                    <input type="text" id="text" name="text" value="+923328347560" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
                                </div>
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <label htmlFor="email-address" className="block text-sm font-medium text-zinc-700">Re-Type Password</label>
                                    <input type="text" id="text" name="text" value="haseeb271002@gmail.com" className="mt-1 block w-full border-zinc-300 rounded-md shadow-sm" />
                                </div>
                            </div>
                           
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="bg-green-500 text-white py-2 px-8 rounded-md">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
