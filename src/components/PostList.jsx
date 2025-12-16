import React, { useState } from 'react';
import { usePosts } from '../context/PostContext';

function PostList() {
  const { posts, openModal } = usePosts();
  const [filter, setFilter] = useState('all');

  const formatDate = (str) => new Date(str).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.platforms.includes(filter);
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

  return (
    <div className="posts-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Scheduled Posts</h2>
        

        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
        >
          <option value="all">All Platforms</option>
          <option value="twitter">Twitter/X</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>
      </div>

      <div className="posts-list-container">
        <div className="posts-list">
          {sortedPosts.length === 0 ? (
             <div className="empty-posts-message" style={{ display: 'block' }}>
                {filter === 'all' ? "No posts scheduled. Create your first post!" : `No ${filter} posts found.`}
             </div>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-title">{post.title}</div>
                  <div className="post-date">{formatDate(post.scheduledFor)}</div>
                </div>
                <div className="post-content">{post.content}</div>
                {post.image && <div className="post-image" style={{ backgroundImage: `url(${post.image})` }}></div>}
                <div className="post-platforms">
                  {post.platforms.map(p => (
                    <span key={p} className="platform-tag">
                      <i className={`fab fa-${p === 'facebook' ? 'facebook-f' : p === 'linkedin' ? 'linkedin-in' : p}`}></i>
                      {' ' + p.charAt(0).toUpperCase() + p.slice(1)}
                    </span>
                  ))}
                </div>
                <div className="post-actions">
                  <button className="delete-post-button" style={{color: '#3b82f6', marginRight: '8px'}} 
                    onClick={() => openModal('EDIT', post)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete-post-button" 
                    onClick={() => openModal('DELETE', post.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostList;