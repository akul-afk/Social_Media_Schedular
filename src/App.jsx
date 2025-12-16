import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostProvider, usePosts } from './context/PostContext';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Toast from './components/Toast';
import './App.css';

// Separate component to consume context
function Dashboard() {
  const { toast, hideToast } = usePosts();

  return (
    <div id="appContainer" className="min-h-screen">
      <Header />
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
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