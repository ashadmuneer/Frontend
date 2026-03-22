import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, User, Share2, ChevronUp, Heart, MessageCircle, Send, Eye } from 'lucide-react';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import { getPublicBlogBySlug, getPublicBlogs, toggleBlogLike, addBlogComment } from '../services/api';

// Simple visitor fingerprint (stable per browser)
function getVisitorId() {
  let id = localStorage.getItem('devi_visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('devi_visitor_id', id);
  }
  return id;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Like state
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // Comment state
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '' });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const { data } = await getPublicBlogBySlug(slug);
      const blogData = data.data;
      setBlog(blogData);
      setLikes(blogData.likes || 0);
      setComments(blogData.comments || []);

      // Check if current visitor already liked
      const visitorId = getVisitorId();
      setLiked((blogData.likedBy || []).includes(visitorId));

      // Fetch recent posts (fallback to any recent if category yields too few)
      try {
        let posts = [];
        if (blogData.category) {
          const catRes = await getPublicBlogs({ category: blogData.category, limit: 4 });
          posts = (catRes.data.data || []).filter((b) => b._id !== blogData._id).slice(0, 3);
        }
        if (posts.length < 3) {
          const recentRes = await getPublicBlogs({ limit: 4 });
          const recentFiltered = (recentRes.data.data || []).filter((b) => b._id !== blogData._id);
          // merge without duplicates
          const ids = new Set(posts.map((p) => p._id));
          posts = [...posts, ...recentFiltered.filter((b) => !ids.has(b._id))].slice(0, 3);
        }
        setRelatedBlogs(posts);
      } catch {
        setRelatedBlogs([]);
      }
    } catch {
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, url: window.location.href });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleLike = async () => {
    try {
      setLikeAnimating(true);
      const visitorId = getVisitorId();
      const { data } = await toggleBlogLike(slug, visitorId);
      setLikes(data.data.likes);
      setLiked(data.data.liked);
      setTimeout(() => setLikeAnimating(false), 600);
    } catch {
      setLikeAnimating(false);
    }
  };

  const handleCommentChange = (e) => {
    setCommentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.message.trim()) return;
    try {
      setCommentSubmitting(true);
      const { data } = await addBlogComment(slug, commentForm);
      setComments((prev) => [...prev, data.data]);
      setCommentForm({ name: '', email: '', message: '' });
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch {
      // silently fail
    } finally {
      setCommentSubmitting(false);
    }
  };

  const formatCommentDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="home-page">
        <AnnouncementBar />
        <Header />
        <main>
          <div className="blog-detail-loading">
            <div className="blog-loading-spinner" />
            <p>Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="home-page">
        <AnnouncementBar />
        <Header />
        <main>
          <div className="blog-not-found">
            <h2>Article Not Found</h2>
            <p>The article you&rsquo;re looking for doesn&rsquo;t exist or has been removed.</p>
            <Link to="/blog" className="home-btn home-btn-primary">
              <ArrowLeft size={18} /> Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-page">
      <AnnouncementBar />
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="blog-detail-breadcrumb">
          <div className="home-container">
            <nav className="blog-breadcrumb-nav">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blog">Blog</Link>
              <span>/</span>
              <span className="blog-breadcrumb-current">{blog.title}</span>
            </nav>
          </div>
        </section>

        {/* Hero / Cover Image */}
        <section className="blog-detail-hero">
          <div className="home-container">
            <div className="blog-detail-hero-inner">
              {blog.category && (
                <span className="blog-detail-category">{blog.category}</span>
              )}
              <h1 className="blog-detail-title">{blog.title}</h1>
              <div className="blog-detail-meta">
                <span className="blog-detail-meta-item">
                  <User size={16} />
                  {blog.author}
                </span>
                <span className="blog-detail-meta-item">
                  <Calendar size={16} />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="blog-detail-meta-item">
                  <Clock size={16} />
                  {blog.readTime} min read
                </span>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="blog-detail-tags">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="blog-detail-tag">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {blog.coverImageUrl && (
          <section className="blog-detail-cover">
            <div className="home-container">
              <div className="blog-detail-cover-wrapper">
                <img src={blog.coverImageUrl} alt={blog.title} />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="blog-detail-content-section">
          <div className="home-container">
            <div className="blog-detail-layout">
              <div>
                <article
                  className="blog-detail-article"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Like & Engagement Bar */}
                <div className="blog-engagement-bar">
                  <button
                    className={`blog-like-btn ${liked ? 'liked' : ''} ${likeAnimating ? 'animating' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart size={20} className={liked ? 'blog-like-icon-filled' : ''} />
                    <span>{likes}</span>
                  </button>
                  <a href="#blog-comments" className="blog-comment-count-btn">
                    <MessageCircle size={20} />
                    <span>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
                  </a>
                  <button className="blog-share-inline-btn" onClick={handleShare}>
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="blog-comments-section" id="blog-comments">
                  <h3 className="blog-comments-heading">
                    <MessageCircle size={22} />
                    Comments ({comments.length})
                  </h3>

                  {/* Comment Form */}
                  <form className="blog-comment-form" onSubmit={handleCommentSubmit}>
                    <h4 className="blog-comment-form-title">Leave a Comment</h4>
                    <div className="blog-comment-form-row">
                      <div className="blog-comment-form-field">
                        <label>Name <span className="blog-required">*</span></label>
                        <input
                          type="text"
                          name="name"
                          value={commentForm.name}
                          onChange={handleCommentChange}
                          required
                          placeholder="Your name"
                          maxLength={80}
                          className="blog-comment-input"
                        />
                      </div>
                      <div className="blog-comment-form-field">
                        <label>Email <span className="blog-optional">(optional)</span></label>
                        <input
                          type="email"
                          name="email"
                          value={commentForm.email}
                          onChange={handleCommentChange}
                          placeholder="your@email.com"
                          className="blog-comment-input"
                        />
                      </div>
                    </div>
                    <div className="blog-comment-form-field">
                      <label>Message <span className="blog-required">*</span></label>
                      <textarea
                        name="message"
                        value={commentForm.message}
                        onChange={handleCommentChange}
                        required
                        placeholder="Share your thoughts..."
                        rows={4}
                        maxLength={1000}
                        className="blog-comment-textarea"
                      />
                      <span className="blog-comment-char-count">{commentForm.message.length}/1000</span>
                    </div>
                    <button
                      type="submit"
                      disabled={commentSubmitting}
                      className="blog-comment-submit-btn"
                    >
                      {commentSubmitting ? (
                        <>
                          <div className="blog-comment-spinner" /> Posting...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Post Comment
                        </>
                      )}
                    </button>
                    {commentSuccess && (
                      <p className="blog-comment-success">Your comment has been posted!</p>
                    )}
                  </form>

                  {/* Comment List */}
                  {comments.length > 0 && (
                    <div className="blog-comment-list">
                      {comments.map((c, i) => (
                        <div key={c._id || i} className="blog-comment-item">
                          <div className="blog-comment-avatar">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="blog-comment-content">
                            <div className="blog-comment-header">
                              <span className="blog-comment-name">{c.name}</span>
                              <span className="blog-comment-time">
                                {formatCommentDate(c.createdAt)}
                              </span>
                            </div>
                            <p className="blog-comment-message">{c.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <aside className="blog-detail-sidebar">
                {/* Like Widget */}
                <div className="blog-sidebar-card">
                  <h4>Show Some Love</h4>
                  <button
                    className={`blog-sidebar-like-btn ${liked ? 'liked' : ''} ${likeAnimating ? 'animating' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart size={22} className={liked ? 'blog-like-icon-filled' : ''} />
                    <span className="blog-sidebar-like-count">{likes}</span>
                    <span className="blog-sidebar-like-label">{liked ? 'Liked!' : 'Like this'}</span>
                  </button>
                </div>

                <div className="blog-sidebar-card">
                  <h4>Share This Article</h4>
                  <button className="blog-share-btn" onClick={handleShare}>
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-sidebar-card">
                    <h4>Tags</h4>
                    <div className="blog-sidebar-tags">
                      {blog.tags.map((tag) => (
                        <Link
                          key={tag}
                          to={`/blog?search=${encodeURIComponent(tag)}`}
                          className="blog-sidebar-tag"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        {relatedBlogs.length > 0 && (
          <section className="blog-recent-section">
            <div className="home-container">
              <div className="blog-recent-header">
                <h2 className="blog-recent-heading">Recent Posts</h2>
                <Link to="/blog" className="blog-recent-see-all">See All</Link>
              </div>
              <div className="blog-recent-grid">
                {relatedBlogs.map((b) => (
                  <Link to={`/blog/${b.slug}`} key={b._id} className="blog-recent-card">
                    <div className="blog-recent-card-image">
                      {b.coverImageUrl ? (
                        <img src={b.coverImageUrl} alt={b.title} />
                      ) : (
                        <div className="blog-recent-card-placeholder">✨</div>
                      )}
                    </div>
                    <div className="blog-recent-card-body">
                      <h3 className="blog-recent-card-title">{b.title}</h3>
                      <div className="blog-recent-card-divider" />
                      <div className="blog-recent-card-stats">
                        <span className="blog-recent-stat">
                          <Eye size={15} />{b.views || 0}
                        </span>
                        <span className="blog-recent-stat">
                          <MessageCircle size={15} />{b.comments?.length || 0}
                        </span>
                        <span className="blog-recent-stat-heart">
                          <Heart size={15} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <section className="blog-back-section">
          <div className="home-container" style={{ textAlign: 'center' }}>
            <Link to="/blog" className="home-btn home-btn-outline">
              <ArrowLeft size={18} /> Back to All Articles
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          className="blog-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <ChevronUp size={22} />
        </button>
      )}
    </div>
  );
}
