import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostProvider, usePosts } from './context/PostContext';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Modal from './components/Modal'; 
import Toast from './components/Toast';
import './App.css';

function Dashboard() {
  const { toast, hideToast, modal, closeModal, deletePost } = usePosts();

  return (
    <div id="appContainer" className="min-h-screen">
      <Header />
      
      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* --- MODAL LOGIC --- */}
      {modal.type === 'DELETE' && (
        <Modal title="Confirm Deletion" onClose={closeModal}>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button className="btn-danger" onClick={deletePost}>Delete Post</button>
          </div>
        </Modal>
      )}

      {modal.type === 'EDIT' && (
        <Modal title="Edit Post" onClose={closeModal}>
          <PostForm initialData={modal.data} />
        </Modal>
      )}

      <div className="content-container">

        <PostForm /> 

        <PostList />
      </div>
    </div>
  );
}

function App() {
  return (
    <PostProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </PostProvider>
  );
}

export default App;