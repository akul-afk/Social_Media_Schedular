import React, { createContext, useState, useEffect, useContext } from 'react';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("scheduledPosts");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentPost, setCurrentPost] = useState(null); // Post currently being edited
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    localStorage.setItem("scheduledPosts", JSON.stringify(posts));
  }, [posts]);

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

// Custom hook for easy access
export const usePosts = () => useContext(PostContext);