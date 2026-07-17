import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Tags, Plus, Send, CornerDownRight, Bookmark, Trash2 } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'discussion', 'teammate_search'
  const [selectedPost, setSelectedPost] = useState(null); // Detail view of a post

  // New Post Form
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('discussion');
  const [tags, setTags] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Comment Form
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('studora_token');
      const typeQuery = filterType === 'all' ? '' : `?type=${filterType}`;
      const res = await fetch(`${API_BASE}/community${typeQuery}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        
        // If we are looking at a selected post, refresh its details too
        if (selectedPost) {
          const freshPost = data.find(p => p._id === selectedPost._id);
          if (freshPost) setSelectedPost(freshPost);
        }
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterType]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setCreateLoading(true);
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, type, tags: tagList })
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setType('discussion');
        setTags('');
        setShowCreate(false);
        fetchPosts();
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    setCommentLoading(true);
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/community/${selectedPost._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      if (res.ok) {
        setCommentText('');
        fetchPosts(); // Will automatically update selectedPost details
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeletePost = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this post?')) return;
    try {
      const token = localStorage.getItem('studora_token');
      const res = await fetch(`${API_BASE}/community/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-100 font-display">Student Community Board</h1>
          <p className="text-sm text-slate-400">Find hackathon teammates, discuss technical courses, and share career insights.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Start Discussion
        </Button>
      </div>

      {/* Create Post Dialog Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-white/10 text-left">
            <h3 className="font-display font-bold text-lg text-slate-200 mb-4">Start New Discussion Thread</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-semibold">Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Need a designer for Harvard Hackathon!" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-semibold">Thread Category</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#080d19] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="discussion">General Discussion</option>
                    <option value="teammate_search">Teammate Search</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-semibold">Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React, UX Design, Global" 
                    value={tags} 
                    onChange={e => setTags(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 font-display">
                <label className="text-xs text-slate-400 font-semibold">Message Body</label>
                <textarea 
                  rows={6} 
                  placeholder="Elaborate on your discussion details or teammate matching criteria..."
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  className="p-3.5 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-violet-500 resize-none font-sans"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" loading={createLoading}>Post Thread</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Layout Split: Left List / Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left List Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 bg-slate-950/30 border border-white/10 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-violet-650 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Threads
            </button>
            <button
              onClick={() => setFilterType('discussion')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                filterType === 'discussion' ? 'bg-violet-650 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Discussions
            </button>
            <button
              onClick={() => setFilterType('teammate_search')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                filterType === 'teammate_search' ? 'bg-violet-650 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Teammate Hunts
            </button>
          </div>

          {/* List items */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-slate-400 py-8">No discussions started in this category yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => {
                const isSelected = selectedPost?._id === post._id;
                const isAuthor = post.authorId === user?.id || user?.role === 'admin';
                return (
                  <GlassCard 
                    key={post._id} 
                    onClick={() => setSelectedPost(post)}
                    className={`border transition-all flex flex-col gap-3 cursor-pointer ${
                      isSelected ? 'border-violet-500 bg-violet-950/10' : 'border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wide border ${
                        post.type === 'teammate_search' 
                          ? 'bg-cyan-950/40 text-cyan-400 border-cyan-800/30' 
                          : 'bg-violet-950/40 text-violet-400 border-violet-800/30'
                      }`}>
                        {post.type === 'teammate_search' ? 'Teammate Search' : 'Discussion'}
                      </span>
                      {isAuthor && (
                        <button
                          onClick={(e) => handleDeletePost(post._id, e)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-base text-slate-200 line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.content}</p>

                    <div className="flex flex-wrap justify-between items-center gap-2 mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-display">
                      <span>Posted by: <span className="font-bold text-slate-400">{post.authorName}</span></span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        {post.comments?.length || 0} Comments
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Details Panel Column */}
        <div className="space-y-4">
          {selectedPost ? (
            <GlassCard className="border border-white/5 flex flex-col gap-4 max-h-[750px] overflow-y-auto">
              <div className="border-b border-white/5 pb-3">
                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-extrabold tracking-wide ${
                  selectedPost.type === 'teammate_search' ? 'bg-cyan-950/40 text-cyan-400' : 'bg-violet-950/40 text-violet-400'
                }`}>
                  {selectedPost.type === 'teammate_search' ? 'Teammate Search' : 'Discussion'}
                </span>
                <h2 className="font-display font-extrabold text-base text-slate-200 mt-2 leading-snug">{selectedPost.title}</h2>
                <p className="text-[10px] text-slate-500 mt-1 font-display">Contributor: {selectedPost.authorName} • {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Body */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{selectedPost.content}</p>

              {/* Tags */}
              {selectedPost.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 border-b border-white/5 pb-4">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[10px] text-slate-400 font-semibold font-display">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments Feed */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs text-slate-200 mb-1 flex items-center gap-1.5 font-display">
                  <MessageSquare className="w-4 h-4 text-violet-400" /> Replies ({selectedPost.comments?.length || 0})
                </h4>

                {selectedPost.comments?.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic py-2">No comments posted yet. Start the conversation!</p>
                ) : (
                  <div className="space-y-3 pl-1">
                    {selectedPost.comments.map(c => (
                      <div key={c._id} className="flex gap-2 items-start text-xs border-l-2 border-violet-500/20 pl-3 py-1">
                        <div className="flex-1">
                          <p className="font-bold text-slate-300 text-[10px] font-display">{c.authorName}</p>
                          <p className="text-slate-400 mt-0.5 leading-relaxed font-sans">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Write comment reply */}
              <form onSubmit={handleCreateComment} className="flex gap-2 border-t border-white/5 pt-4">
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-violet-500 text-slate-200"
                />
                <Button type="submit" variant="primary" size="sm" className="px-3" loading={commentLoading}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </GlassCard>
          ) : (
            <GlassCard className="border border-white/5 text-center py-12 text-slate-500">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs font-display">Select a discussion thread from the list to view replies and leave comments.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
