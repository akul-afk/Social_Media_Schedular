import React, { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';

function PostForm() {
  const { addPost, updatePost, currentPost, cancelEdit } = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);

  // Sync form with 'currentPost' (Edit Mode)
  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
      setContent(currentPost.content);
      setPlatforms(currentPost.platforms);
      setImage(currentPost.image);
      
      const d = new Date(currentPost.scheduledFor);
      setDate(d.toISOString().split('T')[0]);
      setTime(d.toTimeString().slice(0, 5));
    } else {
      resetForm();
    }
  }, [currentPost]);

  // Set default date on load
  useEffect(() => {
    if (!currentPost) resetForm();
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPlatforms([]);
    setImage(null);
    
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    
    setDate(now.toISOString().split('T')[0]);
    setTime(nextHour.toTimeString().slice(0, 5));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || platforms.length === 0) return;

    const postData = {
      id: currentPost ? currentPost.id : Date.now().toString(),
      title,
      content,
      image,
      platforms,
      scheduledFor: new Date(`${date}T${time}`),
      created: currentPost ? currentPost.created : new Date(),
    };

    currentPost ? updatePost(postData) : addPost(postData);
    resetForm();
  };

  const togglePlatform = (id) => {
    setPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file?.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-container">
      <h2>{currentPost ? 'Edit Post' : 'Create Post'}</h2>
      <div className="post-form" style={currentPost ? {border: '2px solid #3b82f6'} : {}}>
        
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <h3>{currentPost ? 'Update Details' : 'Create New Post'}</h3>
          {currentPost && (
            <button onClick={cancelEdit} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}>
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="postTitle">Title</label>
            <input type="text" id="postTitle" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="postContent">Content</label>
            <textarea id="postContent" rows="4" className="input-field" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Image</label>
            <div className="image-upload-container">
              <div className={`image-preview ${image ? 'has-image' : ''}`} style={image ? {backgroundImage: `url(${image})`} : {}}></div>
              <div className="upload-button-container">
                <label htmlFor="imgUp" className="upload-button">
                  <i className="fas fa-cloud-upload-alt"></i> Upload
                </label>
                <input type="file" id="imgUp" accept="image/*" onChange={handleImage} hidden />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Platforms</label>
            <div className="platform-selector">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map(p => (
                <button key={p} type="button" className={`platform-button ${platforms.includes(p) ? 'selected' : ''}`} onClick={() => togglePlatform(p)}>
                  <i className={`fab fa-${p === 'facebook' ? 'facebook-f' : p === 'linkedin' ? 'linkedin-in' : p}`}></i> 
                  {' ' + p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Schedule</label>
            <div className="date-time-container">
              <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="time" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="schedule-button" style={currentPost ? {backgroundColor: '#2563eb'} : {}}>
            {currentPost ? 'Update Post' : 'Schedule Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostForm;