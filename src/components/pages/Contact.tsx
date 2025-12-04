
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Contact Us</h1>
      <div className="bg-white dark:bg-dark-800 shadow rounded-lg p-8">
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-900 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2" placeholder="you@company.com" />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
            <input type="text" id="subject" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-900 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2" placeholder="Feature Request" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-900 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2" placeholder="How can we help?"></textarea>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
