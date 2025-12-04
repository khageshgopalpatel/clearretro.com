
import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/blogPosts';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-gray-900 dark:bg-dark-950 py-20 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full filter blur-3xl opacity-30 animate-blob"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-mono mb-6">
            Engineering <span className="text-brand-500">Insights</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Guides, tutorials, and mental models for high-velocity Agile teams.
          </p>

          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search articles (e.g., 'templates', 'remote')..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-black/30 backdrop-blur-md border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.1)] transition-all duration-300"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider font-mono">Article</span>
                    <span className="text-gray-400 text-xs font-mono">{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 font-mono">
                    Read More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">😕</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No articles found</h3>
            <p className="text-gray-500">Try searching for "retrospective" or "agile".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;