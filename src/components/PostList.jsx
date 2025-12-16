import React from 'react';
import { usePosts } from '../context/PostContext';

function PostList() {
  const { posts, openModal } = usePosts(); // Use openModal instead of direct edit/delete

  const formatDate = (str) => new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const sortedPosts = [...posts].sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

  return (
    <div className="posts-container">
      <h2>Scheduled Posts</h2>
      <div className="posts-list-container">
        <div className="posts-list">
          {sortedPosts.length === 0 ? (
             <div className="empty-posts-message" style={{ display: 'block' }}>No posts scheduled. Create your first post!</div>
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
                  {/* EDIT BUTTON: Opens Edit Modal */}
                  <button className="delete-post-button" style={{color: '#3b82f6', marginRight: '8px'}} 
                    onClick={() => openModal('EDIT', post)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {/* DELETE BUTTON: Opens Delete Modal */}
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