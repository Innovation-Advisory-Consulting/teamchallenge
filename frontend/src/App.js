import React, { useState } from 'react';
import { Container, Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMarkdown('');
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMarkdown(data.markdown || data.error);
    } catch (err) {
      setMarkdown('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Document to Markdown</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
        >
          Choose File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}
      </Box>

      <Button 
        variant="contained" 
        onClick={handleConvert} 
        disabled={!file || loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Convert'}
      </Button>

      {markdown && (
        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6">Result:</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {markdown}
          </pre>
        </Paper>
      )}
    </Container>
  );
}

export default App;
