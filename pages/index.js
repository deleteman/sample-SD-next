import { useState } from 'react';

const MyPage = () => {
  const [prompt, setPrompt] = useState('');
  const [id, setId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the prompt to the backend and get back an ID
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ prompt }),
    });
    const { id } = await response.json();
    setId(id);

    // Poll the backend for the image URL
    const pollInterval = setInterval(async () => {
      const imageResponse = await fetch(`/api/image?id=${id}`);
      const { output } = await imageResponse.json();
      if (output && output.length > 0) {
        const url = output[0]
        setImageUrl(url);
        clearInterval(pollInterval);
      }
    }, 1000);
  };

  return (
    <div className="container">
      <h1 className="title">Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <label className="form-label">
          <span className="form-label-text">Prompt:</span>
          <textarea className="form-textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </label>
        <button className="form-button" type="submit">Generate</button>
      </form>
      {imageUrl && <img className="image" src={imageUrl} />}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .title {
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        .form-label {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        .form-label-text {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .form-textarea {
          height: 10rem;
          padding: 0.5rem;
          font-size: 1.2rem;
          border: 1px solid #ccc;
          border-radius: 0.25rem;
        }
        .form-button {
          padding: 0.5rem;
          font-size: 1.2rem;
          border: none;
          border-radius: 0.25rem;
          background-color: #0070f3;
          color: #fff;
          cursor: pointer;
        }
        .form-button:hover {
          background-color: #0053ad;
        }
        .image {
          margin-top: 2rem;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default MyPage;
