import React, { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';

function PostForm({ initialData = null }) {
  const { addPost, updatePost } = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);

  // --- Custom Time State ---
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('PM');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setPlatforms(initialData.platforms);
      setImage(initialData.image);
      
      const d = new Date(initialData.scheduledFor);
      setDate(d.toISOString().split('T')[0]);
      
      let h = d.getHours();
      const m = d.getMinutes();
      const isPm = h >= 12;
      h = h % 12;
      h = h ? h : 12;
      
      setHour(h.toString().padStart(2, '0'));
      setMinute(m.toString().padStart(2, '0'));
      setAmpm(isPm ? 'PM' : 'AM');
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPlatforms([]);
    setImage(null);
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setHour('12');
    setMinute('00');
    setAmpm('PM');
  };

  // --- UPDATED: Time Handling Logic ---

  // 1. Minute Button Controls (Up/Down)
  const handleMinuteButton = (direction) => {
    let m = parseInt(minute || '0');
    if (direction === 'up') m = (m + 1) % 60;
    if (direction === 'down') m = (m - 1 + 60) % 60;
    setMinute(m.toString().padStart(2, '0'));
  };

  // 2. Typing in Minutes
  const handleMinuteChange = (e) => {
    const val = e.target.value;
    // Allow digits only, max 2 chars
    if (!/^\d{0,2}$/.test(val)) return; 
    setMinute(val);
  };

  const handleMinuteBlur = () => {
    let val = parseInt(minute);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 59) val = 59;
    setMinute(val.toString().padStart(2, '0'));
  };

  // 3. Typing in Hours
  const handleHourChange = (e) => {
    const val = e.target.value;
    // Allow digits only, max 2 chars
    if (!/^\d{0,2}$/.test(val)) return;
    setHour(val);
  };

  const handleHourBlur = () => {
    let val = parseInt(hour);
    // If empty or 0, default to 12. If > 12, clamp to 12.
    if (isNaN(val) || val === 0) val = 12;
    if (val > 12) val = 12;
    setHour(val.toString().padStart(2, '0'));
  };

  const toggleAmpm = () => {
    setAmpm(prev => prev === 'AM' ? 'PM' : 'AM');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || platforms.length === 0) return;

    // Parse hour/minute ensuring they are numbers (in case user leaves empty)
    let h = parseInt(hour) || 12;
    let m = parseInt(minute) || 0;

    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    
    const dateTime = new Date(`${date}T${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:00`);

    const postData = {
      id: initialData ? initialData.id : Date.now().toString(),
      title,
      content,
      image,
      platforms,
      scheduledFor: dateTime,
      created: initialData ? initialData.created : new Date(),
    };

    if (initialData) {
      updatePost(postData);
    } else {
      addPost(postData);
      resetForm();
    }
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

  const renderFormContent = (isEdit) => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="form-group">
        <div className="flex-between">
          <label className="label-no-margin">Content</label>
          <span className={`char-count ${content.length > 280 ? 'limit-exceeded' : ''}`}>
            {content.length} chars
          </span>
        </div>
        <textarea rows="4" className="input-field" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Image</label>
        <div className="image-upload-container">
          <div className={`image-preview ${image ? 'has-image' : ''}`} style={image ? {backgroundImage: `url(${image})`} : {}}></div>
          <div className="upload-button-container">
            <label htmlFor={isEdit ? "editImg" : "createImg"} className="upload-button">
              <i className="fas fa-cloud-upload-alt"></i> Upload
            </label>
            <input type="file" id={isEdit ? "editImg" : "createImg"} accept="image/*" onChange={handleImage} hidden />
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
          
          {/* UPDATED TIME PICKER UI */}
          <div className="time-picker-container">
            <div className="time-input-group">
                {/* Editable Hour Input */}
                <input 
                    type="text" 
                    className="time-input" 
                    value={hour} 
                    onChange={handleHourChange} 
                    onBlur={handleHourBlur}
                    placeholder="12"
                />
                <span className="time-colon">:</span>
                {/* Editable Minute Input */}
                <input 
                    type="text" 
                    className="time-input" 
                    value={minute} 
                    onChange={handleMinuteChange}
                    onBlur={handleMinuteBlur}
                    placeholder="00"
                />
            </div>
            
            <div className="minute-controls">
                <button type="button" className="minute-btn up" onClick={() => handleMinuteButton('up')}>▲</button>
                <button type="button" className="minute-btn down" onClick={() => handleMinuteButton('down')}>▼</button>
            </div>

            <button type="button" className="ampm-toggle" onClick={toggleAmpm}>
                {ampm}
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className="schedule-button" style={isEdit ? {backgroundColor: '#2563eb'} : {}}>
        {isEdit ? 'Save Changes' : 'Schedule Post'}
      </button>
    </form>
  );

  return (
    <div className={initialData ? "" : "form-container"}>
      {!initialData && (
        <>
          <h2>Create Post</h2>
          <div className="post-form">
             <h3>Create New Post</h3> 
             {renderFormContent(false)}
          </div>
        </>
      )}
      {initialData && renderFormContent(true)}
    </div>
  );
}

export default PostForm;