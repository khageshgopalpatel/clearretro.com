
import React, { useEffect } from 'react';

const Terms: React.FC = () => {
    useEffect(() => {
        document.title = "Terms of Service | Clear Retro";
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 font-mono tracking-tight">Terms of Service</h1>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm uppercase tracking-widest">Last Updated: October 25, 2024</p>
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-16 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                    <svg className="w-64 h-64 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight
          prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-gray-900 dark:prose-h3:text-white
          prose-h3:border-l-4 prose-h3:border-brand-500 prose-h3:pl-4
          prose-p:leading-8 prose-p:text-gray-600 dark:prose-p:text-gray-400 
          prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:my-2
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
          prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline">

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using the <strong>Clear Retro</strong> website and application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                    </p>

                    <div className="my-8 h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                    <h3>2. Description of Service</h3>
                    <p>
                        Clear Retro provides a web-based real-time collaboration tool for Agile retrospectives ("the Service"). We reserve the right to modify, suspend, or discontinue the Service at any time, with or without notice.
                    </p>

                    <h3>3. User Accounts</h3>
                    <p>
                        To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>

                    <h3>4. Acceptable Use</h3>
                    <p>You agree not to use the Service to:</p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">
                        <li>Upload or transmit content that is illegal, harmful, threatening, abusive, or defamatory.</li>
                        <li>Violate the intellectual property rights of others.</li>
                        <li>Attempt to interfere with or disrupt the Service servers or networks.</li>
                        <li>Reverse engineer or attempt to extract the source code of the software.</li>
                    </ul>

                    <h3>5. Intellectual Property</h3>
                    <p>
                        The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Clear Retro and its licensors.
                    </p>

                    <h3>6. User Content</h3>
                    <p>
                        You retain ownership of any content you post to the Service ("User Content"). By posting User Content, you grant us a license to use, store, and display such content solely for the purpose of providing the Service to you and your team.
                    </p>

                    <h3>7. Limitation of Liability</h3>
                    <p>
                        In no event shall Clear Retro, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h3>8. Disclaimer</h3>
                    <p>
                        Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
                    </p>

                    <h3>9. Changes to Terms</h3>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>

                    <h3>10. Contact Us</h3>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:legal@clearretro.com">legal@clearretro.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
