import React, { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';

function PostForm({ initialData = null }) {
  const { addPost, updatePost } = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setPlatforms(initialData.platforms);
      setImage(initialData.image);
      const d = new Date(initialData.scheduledFor);
      setDate(d.toISOString().split('T')[0]);
      setTime(d.toTimeString().slice(0, 5));
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
      id: initialData ? initialData.id : Date.now().toString(),
      title,
      content,
      image,
      platforms,
      scheduledFor: new Date(`${date}T${time}`),
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

  return (
    <div className={initialData ? "" : "form-container"}>
      {!initialData && (
        <>
          <h2>Create Post</h2>
          <div className="post-form">
             <h3>Create New Post</h3> 
             <FormContent 
               handleSubmit={handleSubmit} title={title} setTitle={setTitle}
               content={content} setContent={setContent} image={image} 
               handleImage={handleImage} platforms={platforms} 
               togglePlatform={togglePlatform} date={date} setDate={setDate} 
               time={time} setTime={setTime} isEdit={!!initialData}
             />
          </div>
        </>
      )}

      {initialData && (
         <FormContent 
           handleSubmit={handleSubmit} title={title} setTitle={setTitle}
           content={content} setContent={setContent} image={image} 
           handleImage={handleImage} platforms={platforms} 
           togglePlatform={togglePlatform} date={date} setDate={setDate} 
           time={time} setTime={setTime} isEdit={!!initialData}
         />
      )}
    </div>
  );
}

const FormContent = ({ handleSubmit, title, setTitle, content, setContent, image, handleImage, platforms, togglePlatform, date, setDate, time, setTime, isEdit }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Title</label>
      <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
    </div>
    <div className="form-group">
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
        <label style={{marginBottom: 0}}>Content</label>
        <span style={{fontSize: '0.85rem', color: content.length > 280 ? '#ef4444' : '#6b7280'}}>
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
        <input type="time" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
    </div>

    <button type="submit" className="schedule-button" style={isEdit ? {backgroundColor: '#2563eb'} : {}}>
      {isEdit ? 'Save Changes' : 'Schedule Post'}
    </button>
  </form>
);

export default PostForm;