import React from 'react';

function PostList() {
  return (
    <div className="posts-container">
      <h2>Scheduled Posts</h2>
      <div className="posts-list-container">
        <div id="postsList" className="posts-list">
            {/* We will add the list logic later */}
        </div>
        
        <div id="emptyPostsMessage" className="empty-posts-message" style={{ display: 'block' }}>
          No posts scheduled. Create your first post!
        </div>
      </div>
    </div>
  );
}

export default PostList;