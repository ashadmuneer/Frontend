import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Heart, Eye, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { getPublicBlogs, getBlogCategories } from '../services/api';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePageSeo } from '../hooks/usePageSeo';

export default function BlogPage() {
  const { settings } = useSiteSettings();
  usePageSeo(settings?.pageSeo?.blog, {
    title: 'Blog | Divas Lace Wigs',
    description: 'Expert tips, styling guides, and the latest trends in luxury wigs and hair care.',
    keywords: 'wig blog, hair tips, styling guides, hair care',
  });

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 9 };
      if (activeCategory) params.category = activeCategory;
      if (searchTerm) params.search = searchTerm;
      const { data } = await getPublicBlogs(params);
      setBlogs(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await getBlogCategories();
      setCategories(data.data || []);
    } catch {
      setCategories([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="home-page">
      <AnnouncementBar settings={settings?.announcement} />
      <Header navLinks={settings?.navLinks} />
      <main>
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="home-container">
            <div className="blog-hero-content">
              <span className="luxury-section-badge">Our Blog</span>
              <h1>Beauty & Hair Insights</h1>
              <p className="blog-hero-subtitle">
                Discover expert tips, styling guides, and the latest trends in luxury wigs and hair care.
              </p>
              <form onSubmit={handleSearch} className="blog-search-form">
                <div className="blog-search-wrapper">
                  <Search size={20} className="blog-search-icon" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="blog-search-input"
                  />
                  <button type="submit" className="blog-search-btn">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="blog-categories-section">
            <div className="home-container">
              <div className="blog-categories-bar">
                <button
                  className={`blog-category-chip ${!activeCategory ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(''); setCurrentPage(1); }}
                >
                  All Posts
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`blog-category-chip ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="blog-grid-section">
          <div className="home-container">
            {loading ? (
              <div className="blog-loading">
                <div className="blog-loading-spinner" />
                <p>Loading articles...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="blog-empty">
                <div className="blog-empty-icon">📝</div>
                <h3>No articles found</h3>
                <p>Check back soon for new content or try a different search.</p>
              </div>
            ) : (
              <>
                {/* Blog List */}
                <div className="blog-list">
                  {blogs.map((blog) => (
                    <Link
                      to={`/blog/${blog.slug}`}
                      key={blog._id}
                      className="blog-list-card"
                    >
                      <div className="blog-list-image">
                        {blog.coverImageUrl ? (
                          <img src={blog.coverImageUrl} alt={blog.title} />
                        ) : (
                          <div className="blog-placeholder-img">
                            <span>✨</span>
                          </div>
                        )}
                      </div>
                      <div className="blog-list-body">
                        <div className="blog-list-top">
                          <div className="blog-list-header-row">
                            <div className="blog-list-author-info">
                              <div className="blog-list-avatar">
                                {(blog.author || 'A').charAt(0).toUpperCase()}
                              </div>
                              <div className="blog-list-author-meta">
                                <span className="blog-list-author-name">{blog.author || 'Admin'}</span>
                                <span className="blog-list-date-read">
                                  {formatDate(blog.publishedAt)}
                                  {blog.readTime > 0 && (
                                    <>
                                      <span className="blog-list-sep">·</span>
                                      {blog.readTime} min read
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          {blog.category && (
                            <span className="blog-list-category">{blog.category}</span>
                          )}
                          <h2 className="blog-list-title">{blog.title}</h2>
                          {blog.excerpt && (
                            <p className="blog-list-excerpt">{blog.excerpt}</p>
                          )}
                        </div>
                        <div className="blog-list-footer">
                          <div className="blog-list-stats">
                            <span className="blog-list-stat">
                              <Eye size={14} />
                              {blog.likes || 0} views
                            </span>
                            <span className="blog-list-stat">
                              <MessageCircle size={14} />
                              {blog.comments?.length || 0} comment{blog.comments?.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <button
                            className="blog-list-like-btn"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Heart size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="blog-pagination">
                    <button
                      className="blog-page-btn"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>
                    <div className="blog-page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`blog-page-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      className="blog-page-btn"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings?.footer} footerLinkGroups={settings?.footerLinkGroups} />
    </div>
  );
}
