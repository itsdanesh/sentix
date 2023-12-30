import React, { useState } from 'react';
import { api } from '@/api';
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/Button";

const HtmlRenderer = () => {
  const [text, setText] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const explainText = async () => {
    try {
      setLoading(true);
      const content = await api.explainText(text);
      setHtmlContent(content);
      setLoading(false);
    } catch (err) {
      setError('Error explaining the text with AI');
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
     <p className="text-sm font-light">Here you can enter a text and the system will visualize how and based on what words the AI model predict the sentiment of the text.</p>
      <TextArea
        className='flex-grow resize-none'
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text here to explain!"
        rows={4}
        style={{ width: '50%', marginBottom: '10px', color: 'white' }}
      />
      <div style={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
        <Button className="grow" onClick={explainText} style={{ margin: '20px auto' }}>Explain</Button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <iframe
        srcDoc={htmlContent}
        style={{ width: '100%', height: '270px', border: 'none', backgroundColor: 'white' }}
        title="HTML Content"
        sandbox="allow-scripts"
      />
    </div>

  );
};

export default HtmlRenderer;
