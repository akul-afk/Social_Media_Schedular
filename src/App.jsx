import React from 'react';
import './App.css';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

function App() {
  return (
    <div id="appContainer" className="min-h-screen">
      <Header />
      
      <div className="content-container">
        <PostForm />
        <PostList />
      </div>
    </div>
  );
}

export default App;