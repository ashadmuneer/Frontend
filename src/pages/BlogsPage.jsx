import { useState, useEffect } from 'react';
import {
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadInlineBlogImage,
  getAdminBlogComments,
  toggleCommentApproval,
  deleteComment,
} from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  X,
  Image,
  Tag,
  Save,
  ArrowLeft,
  Heart,
  MessageCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [commentPanel, setCommentPanel] = useState(null); // blog object
  const [commentList, setCommentList] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [filterStatus]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      const res = await getAdminBlogs(params);
      setBlogs(res.data.data || []);
    } catch {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    try {
      await deleteBlog(id);
      toast.success('Blog post deleted');
      fetchBlogs();
    } catch {
      toast.error('Failed to delete blog post');
    }
  };

  const handleSave = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await updateBlog(editBlog._id, formData);
        toast.success('Blog post updated');
      } else {
        await createBlog(formData);
        toast.success('Blog post created');
      }
      setShowEditor(false);
      setEditBlog(null);
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog post');
      throw err;
    }
  };

  const openCreate = () => {
    setEditBlog(null);
    setShowEditor(true);
  };

  const openEdit = (blog) => {
    setEditBlog(blog);
    setShowEditor(true);
  };

  const openComments = async (blog) => {
    setCommentPanel(blog);
    setCommentLoading(true);
    try {
      const res = await getAdminBlogComments(blog._id);
      setCommentList(res.data.data || []);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleToggleApproval = async (commentId) => {
    try {
      const res = await toggleCommentApproval(commentPanel._id, commentId);
      const updated = res.data.data;
      setCommentList((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, isApproved: updated.isApproved } : c))
      );
      toast.success(updated.isApproved ? 'Comment approved' : 'Comment hidden');
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      await deleteComment(commentPanel._id, commentId);
      setCommentList((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.title.toLowerCase().includes(term) ||
      b.slug.toLowerCase().includes(term) ||
      b.category?.toLowerCase().includes(term)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Show editor if active
  if (showEditor) {
    return (
      <BlogEditor
        blog={editBlog}
        onSave={handleSave}
        onCancel={() => { setShowEditor(false); setEditBlog(null); }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Blog Posts
          </h1>
          <p className="text-text-secondary mt-1">Create and manage your blog content</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-border-focus transition-colors"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted glass-card">
          <FileText className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-lg">No blog posts found</p>
          <button
            onClick={openCreate}
            className="mt-4 text-accent hover:text-accent-hover text-sm font-medium cursor-pointer"
          >
            Create your first blog post
          </button>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="glass-card p-4 flex items-center gap-4 group hover:border-accent/30 transition-all"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-bg-hover">
                {blog.coverImageUrl ? (
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <FileText className="w-8 h-8 opacity-40" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-text-primary font-semibold text-sm truncate">
                    {blog.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                      blog.isPublished
                        ? 'bg-success/15 text-success'
                        : 'bg-warning/15 text-warning'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-text-muted text-xs truncate mb-1.5">
                  {blog.excerpt || 'No excerpt'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                  {blog.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {blog.category}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readTime || 1} min
                  </span>
                  <span className="flex items-center gap-1 text-pink-400">
                    <Heart className="w-3 h-3" />
                    {blog.likes || 0}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); openComments(blog); }}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {blog.comments?.length || 0}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(blog)}
                  className="p-2 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id, blog.title)}
                  className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Management Panel */}
      {commentPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2
                  className="text-lg font-bold text-text-primary"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Comments
                </h2>
                <p className="text-text-muted text-xs mt-0.5 truncate max-w-md">
                  {commentPanel.title}
                </p>
              </div>
              <button
                onClick={() => setCommentPanel(null)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {commentLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                </div>
              ) : commentList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <MessageCircle className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">No comments yet</p>
                </div>
              ) : (
                commentList.map((c) => (
                  <div
                    key={c._id}
                    className={`p-4 rounded-xl border transition-colors ${
                      c.isApproved
                        ? 'bg-bg-secondary border-border'
                        : 'bg-warning/5 border-warning/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-text-primary">{c.name}</span>
                          {c.email && (
                            <span className="text-[11px] text-text-muted">{c.email}</span>
                          )}
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                              c.isApproved
                                ? 'bg-success/15 text-success'
                                : 'bg-warning/15 text-warning'
                            }`}
                          >
                            {c.isApproved ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{c.message}</p>
                        <p className="text-[11px] text-text-muted mt-1.5">
                          {formatDate(c.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleApproval(c._id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            c.isApproved
                              ? 'text-warning hover:bg-warning/10'
                              : 'text-success hover:bg-success/10'
                          }`}
                          title={c.isApproved ? 'Hide comment' : 'Approve comment'}
                        >
                          {c.isApproved ? <EyeOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Blog Editor Component (Create / Edit)
// ============================================================

function BlogEditor({ blog, onSave, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState(blog?.coverImageUrl || '');
  const [form, setForm] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    category: blog?.category || 'General',
    tags: blog?.tags?.join(', ') || '',
    author: blog?.author || 'Admin',
    isPublished: blog?.isPublished || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title' && !blog) {
      const slugVal = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setForm((prev) => ({ ...prev, slug: slugVal }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleInlineImageUpload = async (file) => {
    const payload = new FormData();
    payload.append('image', file);
    const res = await uploadInlineBlogImage(payload);
    return res?.data?.data?.url || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('slug', form.slug);
      formData.append('excerpt', form.excerpt);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('tags', form.tags);
      formData.append('author', form.author);
      formData.append('isPublished', form.isPublished);

      const coverInput = document.getElementById('coverImageInput');
      if (coverInput?.files[0]) {
        formData.append('coverImage', coverInput.files[0]);
      }

      await onSave(formData, !!blog);
    } catch {
      // error handled in parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1
            className="text-2xl font-bold text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {blog ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {blog ? 'Update your existing post' : 'Write something amazing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-5">
            {/* Title */}
            <div className="glass-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter blog post title..."
                  className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-base focus:outline-none focus:border-border-focus transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Slug <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  placeholder="url-friendly-slug"
                  className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-secondary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={2}
                  maxLength={300}
                  placeholder="Brief summary of the article (max 300 characters)..."
                  className="w-full px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors resize-none"
                />
                <p className="text-[11px] text-text-muted mt-1">{form.excerpt.length}/300</p>
              </div>
            </div>

            {/* Content */}
            <div className="glass-card p-5">
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Content <span className="text-danger">*</span>
              </label>
              <p className="text-[11px] text-text-muted mb-2">
                Use the toolbar to add headings, links, and multiple inline images between paragraphs.
              </p>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                onImageUpload={handleInlineImageUpload}
                placeholder="Write your blog content here..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish Settings */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Eye className="w-4 h-4 text-accent" />
                Publish Settings
              </h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={form.isPublished}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-bg-hover rounded-full peer-checked:bg-accent transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {form.isPublished ? 'Published' : 'Draft'}
                </span>
              </label>
            </div>

            {/* Cover Image */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Image className="w-4 h-4 text-accent" />
                Cover Image
              </h3>
              {coverPreview && (
                <div className="relative rounded-lg overflow-hidden aspect-video">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverPreview('');
                      const input = document.getElementById('coverImageInput');
                      if (input) input.value = '';
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
                <Image className="w-8 h-8 text-text-muted mb-2" />
                <span className="text-sm text-text-muted">Click to upload cover image</span>
                <span className="text-[11px] text-text-muted mt-1">JPG, PNG, WebP, AVIF (max 10MB)</span>
                <input
                  type="file"
                  id="coverImageInput"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Category & Tags */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Tag className="w-4 h-4 text-accent" />
                Organization
              </h3>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Hair Care, Styling Tips"
                  className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. wigs, hair care, tips"
                  className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-text-secondary text-sm font-medium hover:bg-bg-hover transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-bg-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
