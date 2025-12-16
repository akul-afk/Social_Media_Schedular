import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Toast from './components/Toast';

function Dashboard() {
  // --- STATE ---
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("scheduledPosts");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [editingPost, setEditingPost] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("scheduledPosts", JSON.stringify(posts));
  }, [posts]);

  // --- ACTIONS ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleAddPost = (newPost) => {
    setPosts((prev) => [...prev, newPost]);
    showToast('Post scheduled successfully!', 'success');
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setEditingPost(null); // Exit edit mode
    showToast('Post updated successfully!', 'success');
  };

  const handleDeletePost = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
      // If we were editing the post we just deleted, clear the form
      if (editingPost && editingPost.id === id) {
        setEditingPost(null);
      }
      showToast('Post deleted successfully', 'success'); // Green toast for success
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    showToast('Editing mode enabled', 'success'); // Just to give feedback
    // Scroll to top on mobile so they see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div id="appContainer" className="min-h-screen">
      <Header />
      
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      <div className="content-container">
        {/* Pass editing state and handlers to Form */}
        <PostForm 
          onAddPost={handleAddPost} 
          onUpdatePost={handleUpdatePost}
          postToEdit={editingPost}
          onCancelEdit={handleCancelEdit}
        />
        
        {/* Pass handlers to List */}
        <PostList 
          posts={posts} 
          onDeletePost={handleDeletePost} 
          onEditPost={handleEditClick}
        />
      </div>
    </div>
  );
}

// Wrap in Router (Fulfilling Stage 5 Requirement)
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;