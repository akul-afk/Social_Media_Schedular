import React, { useState, useEffect } from 'react';

function PostForm({ onAddPost }) {
  // --- STATE MANAGEMENT ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]); // Array to store selected platform IDs
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null); // Stores the Base64 image string

  // --- EXTRA FEATURE: Initial Setup (Auto-set Date/Time) ---
  useEffect(() => {
    const today = new Date();
    // Format Date: YYYY-MM-DD
    const dateStr = today.toISOString().split('T')[0];
    
    // Format Time: Next hour, rounded to nearest 15 mins
    const nextHour = new Date(today);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    const timeStr = nextHour.toTimeString().slice(0, 5); // HH:MM

    setDate(dateStr);
    setTime(timeStr);
  }, []);

  // --- HANDLERS ---

  // Handle Platform Toggle
  const togglePlatform = (platformId) => {
    setPlatforms((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter((p) => p !== platformId); // Remove if exists
      } else {
        return [...prev, platformId]; // Add if not exists
      }
    });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result); // Set preview URL
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!title.trim() || !content.trim() || platforms.length === 0) {
      alert("Please fill in all required fields and select a platform.");
      return;
    }

    // Create the post object
    const newPost = {
      id: Date.now().toString(), // Simple unique ID
      title,
      content,
      image,
      platforms,
      scheduledFor: new Date(`${date}T${time}`),
      created: new Date(),
    };

    console.log("New Post Created:", newPost);
    
    // We will hook this up to the list in the next stage!
    // if (onAddPost) onAddPost(newPost); 

    alert("Post scheduled! (Check console for data)");
    
    // Optional: Reset form here if needed
  };

  // --- EXTRA FEATURE: Get min date for validation ---
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  return (
    <div className="form-container">
      <h2>Create Post</h2>
      <div className="post-form">
        <h3>Create New Post</h3>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="postTitle">Title</label>
            <input
              type="text"
              id="postTitle"
              placeholder="Enter post title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content with Character Count Feature */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="postContent">Content</label>
              <span style={{ fontSize: '0.75rem', color: content.length > 280 ? 'red' : '#6b7280' }}>
                {content.length} chars
              </span>
            </div>
            <textarea
              id="postContent"
              placeholder="What's on your mind?"
              rows="4"
              className="input-field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="postImage">Image (optional)</label>
            <div className="image-upload-container">
              {/* Conditional Rendering for Preview */}
              <div 
                id="imagePreview" 
                className={`image-preview ${image ? 'has-image' : ''}`}
                style={image ? { backgroundImage: `url(${image})` } : {}}
              ></div>
              
              <div className="upload-button-container">
                <label htmlFor="imageUpload" className="upload-button">
                  <i className="fas fa-cloud-upload-alt"></i> Upload Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="form-group">
            <label>Platforms</label>
            <div className="platform-selector">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className={`platform-button ${platforms.includes(platform) ? 'selected' : ''}`}
                  onClick={() => togglePlatform(platform)}
                >
                  <i className={`fab fa-${platform === 'twitter' ? 'twitter' : platform === 'facebook' ? 'facebook-f' : platform === 'linkedin' ? 'linkedin-in' : platform}`}></i> 
                  {' ' + platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="form-group">
            <label>Schedule Date & Time</label>
            <div className="date-time-container">
              <div className="date-input-container">
                <label htmlFor="scheduleDate" className="input-label">Date</label>
                <input
                  type="date"
                  id="scheduleDate"
                  className="input-field"
                  min={getTodayDate()} // Block past dates
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="time-input-container">
                <label htmlFor="scheduleTime" className="input-label">Time</label>
                <input
                  type="time"
                  id="scheduleTime"
                  className="input-field"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="schedule-button">
            Schedule Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostForm;