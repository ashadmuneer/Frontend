import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Ensure the CSS is imported

const App = () => {
  const [color, setColor] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color) {
      setError('Please select a color.');
      return;
    }

    try {
      setError('');
      const response = await axios.post('/recommend', { color });
      setRecommendations(response.data);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Outfit Recommendation</h1>

      <div className="main-content">
        {/* Image Section */}
        <div className="image-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="image-upload"
          />
          {image && <img src={image} alt="Preview" className="image-preview" />}
        </div>

        {/* Recommendation Section */}
        <div className="recommendation-section">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
              <div>
                <input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="color-picker"
                />
                <button type="submit" className="submit-btn">Get Recommendations</button>
              </div>
            </form>
          </div>

          {error && <p className="error-message">{error}</p>}

          {recommendations.length > 0 && (
            <div className="recommendations-container">
              {recommendations.map((rec, index) => {
                const colorName = rec.Topwear_Color_Name || '#ddd'; // Use default color if undefined
                return (
                  <div key={index} className="card">
                    {/* Color Circle */}
                    <div
                      className="recommended-color-circle"
                      style={{ backgroundColor: colorName }}
                    ></div>
                    <div className="card-content">
                      <h3 className="mood">{rec.Mood_Conveyed} - {colorName}</h3>
                      <p><strong>Occasion:</strong> {rec.Occasion}</p>
                      <p><strong>Season:</strong> {rec.Season}</p>
                      <p><strong>Skin Tone Compatibility:</strong> {rec.Skin_Tone_Compatibility}</p>
                      <p><strong>Time of Day Preference:</strong> {rec.Time_of_Day_Preference}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
