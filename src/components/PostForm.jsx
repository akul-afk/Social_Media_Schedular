import React from 'react';

function PostForm() {
  return (
    <div className="form-container">
      <h2>Create Post</h2>
      <div className="post-form">
        <h3>Create New Post</h3>

        <form id="postForm">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="postTitle">Title</label>
            <input
              type="text"
              id="postTitle"
              placeholder="Enter post title"
              className="input-field"
              required
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="postContent">Content</label>
            <textarea
              id="postContent"
              placeholder="What's on your mind?"
              rows="4"
              className="input-field"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="postImage">Image (optional)</label>
            <div className="image-upload-container">
              <div id="imagePreview" className="image-preview"></div>
              <div className="upload-button-container">
                <label htmlFor="imageUpload" className="upload-button">
                  <i className="fas fa-cloud-upload-alt"></i> Upload Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  hidden
                />
              </div>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="form-group">
            <label>Platforms</label>
            <div id="platforms" className="platform-selector">
              <button type="button" className="platform-button" data-platform="twitter">
                <i className="fab fa-twitter"></i> Twitter/X
              </button>
              <button type="button" className="platform-button" data-platform="facebook">
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
              <button type="button" className="platform-button" data-platform="instagram">
                <i className="fab fa-instagram"></i> Instagram
              </button>
              <button type="button" className="platform-button" data-platform="linkedin">
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </button>
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
                  required
                />
              </div>
              <div className="time-input-container">
                <label htmlFor="scheduleTime" className="input-label">Time</label>
                <input
                  type="time"
                  id="scheduleTime"
                  className="input-field"
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