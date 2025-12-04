
import React, { useEffect, useState } from 'react';
import { BLOG_POSTS, type FAQ } from '../../data/blogPosts';

const FAQSection: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-mono">Frequently Asked Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-dark-950">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <span className="font-bold text-gray-800 dark:text-gray-200 font-mono">{faq.question}</span>
              <span className="text-brand-500 text-xl">{openIndex === idx ? '−' : '+'}</span>
            </button>
            {openIndex === idx && (
              <div className="p-4 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-dark-900/50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface BlogPostProps {
  slug: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ slug }) => {
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Clear Retro Blog`;

      const updateMeta = (name: string, content: string) => {
        let element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      updateMeta('description', post.excerpt);
      updateMeta('keywords', post.keywords);

      // Inject JSON-LD
      if (post.jsonLd) {
        let script = document.querySelector('#json-ld-data');
        if (!script) {
          script = document.createElement('script');
          script.id = 'json-ld-data';
          script.setAttribute('type', 'application/ld+json');
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(post.jsonLd);
      }
    }

    return () => {
      // Cleanup JSON-LD on unmount
      const script = document.querySelector('#json-ld-data');
      if (script) script.remove();
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Article Not Found</h1>
        <button onClick={() => window.location.href = '/blog'} className="text-brand-600 hover:underline">Return to Blog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero */}
      <div className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-gray-800 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-600 mb-8 transition-colors font-mono">
            ← Back to Stream
          </a>

          <div className="flex items-center gap-4 mb-6 text-sm font-mono text-gray-500 dark:text-gray-400">
            <span className="bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 px-2 py-1 rounded">{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6 font-mono">
            {post.title}
          </h1>

          <p className="text-xl text-gray-500 dark:text-gray-300 leading-relaxed font-light border-l-4 border-brand-500 pl-4">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Article Image */}
        {post.imageAlt && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
            <img
              src={`https://placehold.co/1200x630/18181b/2dd4bf?text=${encodeURIComponent(post.title)}`}
              alt={post.imageAlt}
              className="w-full h-auto object-cover"
              width="1200"
              height="630"
            />
          </div>
        )}

        <article className="prose prose-lg dark:prose-invert prose-headings:font-mono prose-headings:font-bold prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-500 prose-img:rounded-xl prose-img:shadow-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* FAQs */}
        {post.faqs && <FAQSection faqs={post.faqs} />}

        {/* CTA */}
        <div className="mt-20 p-10 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg className="w-40 h-40 text-brand-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-mono">Ready to improve your team?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
              Start your first retrospective in seconds. No credit card required. Experience the speed of Clear Retro today.
            </p>
            <a href="/dashboard" className="inline-block px-8 py-4 bg-brand-600 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:bg-brand-700 transition-all hover:-translate-y-1">
              Start Free Retro Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
