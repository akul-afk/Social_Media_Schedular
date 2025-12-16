import React, { createContext, useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useLocalStorage("scheduledPosts", []);
  
  const [modal, setModal] = useState({ type: null, data: null }); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const notify = (message, type = 'success') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ ...toast, show: false });

  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });

  const addPost = (post) => {
    setPosts((prev) => [...prev, post]);
    notify('Post scheduled successfully!');
  };

  const updatePost = (updated) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    closeModal();
    notify('Post updated!');
  };

  const deletePost = () => {
    if (modal.data) {
      setPosts((prev) => prev.filter((p) => p.id !== modal.data));
      closeModal();
      notify('Post deleted');
    }
  };

  // --- NEW: Drag and Drop Logic ---
  const reorderPosts = (dragIndex, hoverIndex) => {
    const newPosts = [...posts];
    const [draggedItem] = newPosts.splice(dragIndex, 1);
    newPosts.splice(hoverIndex, 0, draggedItem);
    setPosts(newPosts);
  };

  return (
    <PostContext.Provider value={{
      posts,
      modal,
      toast,
      openModal,
      closeModal,
      addPost,
      deletePost,
      updatePost,
      hideToast,
      reorderPosts 
    }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);