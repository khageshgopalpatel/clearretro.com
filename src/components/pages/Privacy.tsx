
import React, { useEffect } from 'react';

const Privacy: React.FC = () => {
    useEffect(() => {
        document.title = "Privacy Policy | Clear Retro";
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 font-mono tracking-tight">Privacy Policy</h1>
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm uppercase tracking-widest">Last Updated: October 25, 2024</p>
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 md:p-16 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                    <svg className="w-64 h-64 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight
          prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-gray-900 dark:prose-h3:text-white
          prose-h3:border-l-4 prose-h3:border-brand-500 prose-h3:pl-4
          prose-p:leading-8 prose-p:text-gray-600 dark:prose-p:text-gray-400 
          prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:my-2
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
          prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline">

                    <p className="lead text-xl text-gray-700 dark:text-gray-300 mb-10">
                        At <strong>Clear Retro</strong> ("we", "us", or "our"), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and application.
                    </p>

                    <div className="my-8 h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                    <h3>1. Information We Collect</h3>
                    <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">
                        <li><strong>Account Information:</strong> When you sign up, we collect your email address and name (via Google Auth or email).</li>
                        <li><strong>Retrospective Data:</strong> The content you create on boards (cards, columns, votes) is stored to provide the service.</li>
                        <li><strong>Usage Data:</strong> We collect anonymous data on how you interact with the app (e.g., button clicks, page views) to improve performance.</li>
                    </ul>

                    <h3>2. AI Processing & Data Privacy</h3>
                    <p>
                        Clear Retro uses <strong>AI</strong> to provide features like "Smart Grouping" and "Retro Summaries".
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">
                        <li><strong>Transient Processing:</strong> Data sent to the AI model is used solely for the purpose of generating the requested output (grouping or summary).</li>
                        <li><strong>No Training:</strong> Your retrospective data is <strong>not</strong> used to train Google's public AI models.</li>
                        <li><strong>Data Security:</strong> Data is encrypted in transit between our servers and the AI provider.</li>
                    </ul>

                    <h3>3. How We Use Your Information</h3>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process transactions and manage your account.</li>
                        <li>Send you technical notices, updates, and support messages.</li>
                        <li>Respond to your comments and customer service requests.</li>
                    </ul>

                    <h3>4. Data Storage and Security</h3>
                    <p>
                        We use industry-standard encryption protocols (SSL/TLS) to protect data in transit. Your data is stored on secure servers provided by <strong>Google Cloud Platform (Firebase)</strong>. While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet is 100% secure.
                    </p>

                    <h3>5. Third-Party Services</h3>
                    <p>
                        We may employ third-party companies and individuals due to the following reasons:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-brand-500">
                        <li>To facilitate our Service (e.g., Firebase for hosting/DB).</li>
                        <li>To provide the Service on our behalf.</li>
                        <li>To perform Service-related services.</li>
                    </ul>

                    <h3>6. Your Rights</h3>
                    <p>
                        You have the right to access, correct, or delete your personal data. You can delete your boards directly within the application. For complete account deletion, please contact us.
                    </p>

                    <h3>7. Contact Us</h3>
                    <p>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:privacy@clearretro.com">privacy@clearretro.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
