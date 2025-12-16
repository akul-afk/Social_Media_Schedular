import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const PostContext = createContext();

export function PostProvider({ children }) {
  // Uses our new custom hook - logic handles itself!
  const [posts, setPosts] = useLocalStorage("scheduledPosts", []);
  
  const [currentPost, setCurrentPost] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Actions
  const notify = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => setToast({ ...toast, show: false });

  const addPost = (post) => {
    setPosts((prev) => [...prev, post]);
    notify('Post scheduled successfully!');
  };

  const deletePost = (id) => {
    if (window.confirm("Delete this post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (currentPost?.id === id) setCurrentPost(null);
      notify('Post deleted');
    }
  };

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setCurrentPost(null);
    notify('Post updated!');
  };

  const editPost = (post) => {
    setCurrentPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify('Editing mode enabled', 'success');
  };

  const cancelEdit = () => setCurrentPost(null);

  return (
    <PostContext.Provider value={{
      posts,
      currentPost,
      toast,
      addPost,
      deletePost,
      updatePost,
      editPost,
      cancelEdit,
      hideToast
    }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);