import React from 'react';

function PostList({ posts, onDeletePost, onEditPost }) {
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const sortedPosts = [...posts].sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

  return (
    <div className="posts-container">
      <h2>Scheduled Posts</h2>
      <div className="posts-list-container">
        <div id="postsList" className="posts-list">
          
          {sortedPosts.length === 0 ? (
             <div className="empty-posts-message" style={{ display: 'block' }}>
                No posts scheduled. Create your first post!
             </div>
          ) : (
            sortedPosts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-title">{post.title}</div>
                  <div className="post-date">{formatDate(post.scheduledFor)}</div>
                </div>

                <div className="post-content">{post.content}</div>

                {post.image && (
                  <div className="post-image" style={{ backgroundImage: `url(${post.image})` }}></div>
                )}

                <div className="post-platforms">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="platform-tag">
                       {/* Icon logic simplified for brevity, assumes you have FontAwesome loaded */}
                      <i className={`fab fa-${platform === 'twitter' ? 'twitter' : platform === 'facebook' ? 'facebook-f' : platform === 'linkedin' ? 'linkedin-in' : platform}`}></i>
                      {' ' + platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                  ))}
                </div>

                <div className="post-actions">
                  {/* EDIT BUTTON */}
                  <button 
                    className="delete-post-button" 
                    style={{ color: '#3b82f6', marginRight: '8px' }}
                    onClick={() => onEditPost(post)}
                    title="Edit post"
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  {/* DELETE BUTTON */}
                  <button 
                    className="delete-post-button" 
                    onClick={() => onDeletePost(post.id)}
                    title="Delete post"
                  >
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