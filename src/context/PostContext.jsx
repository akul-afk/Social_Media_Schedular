import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useLocalStorage("scheduledPosts", []);
  
  // --- New Modal State ---
  const [modal, setModal] = useState({ type: null, data: null }); // type: 'DELETE' | 'EDIT'
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const notify = (message, type = 'success') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ ...toast, show: false });

  // --- Actions ---
  const openModal = (type, data = null) => {
    setModal({ type, data });
  };

  const closeModal = () => {
    setModal({ type: null, data: null });
  };

  const addPost = (post) => {
    setPosts((prev) => [...prev, post]);
    notify('Post scheduled successfully!');
  };

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    closeModal(); // Close modal after edit
    notify('Post updated!');
  };

  const deletePost = () => {
    if (modal.data) { // modal.data holds the ID to delete
      setPosts((prev) => prev.filter((p) => p.id !== modal.data));
      closeModal();
      notify('Post deleted');
    }
  };

  return (
    <PostContext.Provider value={{
      posts,
      modal,       // exposing modal state
      toast,
      openModal,   // exposing opener
      closeModal,  // exposing closer
      addPost,
      deletePost,
      updatePost,
      hideToast
    }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);