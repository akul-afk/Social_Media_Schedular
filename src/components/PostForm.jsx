import React, { useState, useEffect } from 'react';

function PostForm({ onAddPost, onUpdatePost, postToEdit, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);

  // --- EFFECT: Populate form when 'postToEdit' changes ---
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setPlatforms(postToEdit.platforms);
      setImage(postToEdit.image);
      
      // Parse the date object back to input strings
      const dateObj = new Date(postToEdit.scheduledFor);
      setDate(dateObj.toISOString().split('T')[0]);
      
      // Time is tricky because of timezone offsets, simplified here:
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    } else {
      resetForm();
    }
  }, [postToEdit]);

  // Initialize Default Date (Only if not editing)
  useEffect(() => {
    if (!postToEdit) {
      resetForm();
    }
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPlatforms([]);
    setImage(null);
    
    const today = new Date();
    const nextHour = new Date(today);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    
    setDate(today.toISOString().split('T')[0]);
    setTime(nextHour.toTimeString().slice(0, 5));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || platforms.length === 0) {
      return; // Validation handled by browser 'required' or custom toast in parent
    }

    const postData = {
      id: postToEdit ? postToEdit.id : Date.now().toString(),
      title,
      content,
      image,
      platforms,
      scheduledFor: new Date(`${date}T${time}`),
      created: postToEdit ? postToEdit.created : new Date(),
    };

    if (postToEdit) {
      onUpdatePost(postData);
    } else {
      onAddPost(postData);
    }
    
    resetForm();
  };

  const togglePlatform = (platformId) => {
    setPlatforms((prev) => 
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="form-container">
      <h2>{postToEdit ? 'Edit Post' : 'Create Post'}</h2>
      <div className="post-form" style={postToEdit ? {border: '2px solid #3b82f6'} : {}}>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>{postToEdit ? 'Update Details' : 'Create New Post'}</h3>
          {postToEdit && (
            <button 
              type="button" 
              onClick={onCancelEdit}
              style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline'}}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="postTitle">Title</label>
            <input
              type="text"
              id="postTitle"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="postContent">Content</label>
            <textarea
              id="postContent"
              rows="4"
              className="input-field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Image */}
          <div className="form-group">
            <label>Image (optional)</label>
            <div className="image-upload-container">
              <div 
                className={`image-preview ${image ? 'has-image' : ''}`}
                style={image ? { backgroundImage: `url(${image})` } : {}}
              ></div>
              <div className="upload-button-container">
                <label htmlFor="imageUpload" className="upload-button">
                  <i className="fas fa-cloud-upload-alt"></i> {image ? 'Change Image' : 'Upload Image'}
                </label>
                <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} hidden />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="form-group">
            <label>Platforms</label>
            <div className="platform-selector">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`platform-button ${platforms.includes(p) ? 'selected' : ''}`}
                  onClick={() => togglePlatform(p)}
                >
                  <i className={`fab fa-${p === 'twitter' ? 'twitter' : p === 'facebook' ? 'facebook-f' : p === 'linkedin' ? 'linkedin-in' : p}`}></i> 
                  {' ' + p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-group">
            <label>Schedule</label>
            <div className="date-time-container">
              <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
              <input type="time" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="schedule-button" style={postToEdit ? {backgroundColor: '#2563eb'} : {}}>
            {postToEdit ? 'Update Post' : 'Schedule Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostForm;