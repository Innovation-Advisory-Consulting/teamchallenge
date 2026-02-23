import React, { useState } from 'react';
import {
  Container, Box, Button, Typography, Paper, CircularProgress,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CloudUpload, FileDownload, AutoAwesome } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2196F3' },
    background: { default: '#0d1117', paper: '#161b22' },
    text: { primary: '#e6edf3', secondary: '#8b949e' },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 10,
        },
      },
    },
  },
});

const API_URL = process.env.REACT_APP_API_URL || 'https://mark-down-container.jollymeadow-0111d26b.westus2.azurecontainerapps.io';

function App() {
  const [file, setFile] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMarkdown('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setMarkdown('');
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_URL}/convert`, { method: 'POST', body: formData });
      const data = await res.json();
      setMarkdown(data.markdown || data.error || '');
    } catch (err) {
      setMarkdown('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!markdown) return;
    const baseName = file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'converted';
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <AutoAwesome sx={{ color: '#2196F3', fontSize: 28 }} />
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Document to Markdown
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Convert your documents to clean Markdown in seconds
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Supports PDF, DOCX, PPTX and more — powered by Azure AI
            </Typography>
          </Box>

          {/* Main Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              bgcolor: 'background.paper',
            }}
          >
            {/* Drop Zone */}
            <Box
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              sx={{
                border: `2px dashed ${dragging ? '#2196F3' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 2,
                p: 4,
                mb: 3,
                textAlign: 'center',
                bgcolor: dragging ? 'rgba(33,150,243,0.06)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: '#2196F3', mb: 1.5, opacity: 0.85 }} />
              <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                Drop your file here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                PDF, DOCX, PPTX and more — or click to browse
              </Typography>
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ borderColor: 'rgba(33,150,243,0.5)', color: '#2196F3' }}
              >
                Browse file
                <input type="file" hidden onChange={handleFileChange} />
              </Button>

              {file && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(33,150,243,0.1)',
                    border: '1px solid rgba(33,150,243,0.3)',
                    borderRadius: 2,
                    px: 2,
                    py: 0.75,
                  }}
                >
                  <Typography variant="body2" color="primary" fontWeight={500}>
                    {file.name}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleConvert}
                disabled={!file || loading}
                disableElevation
                sx={{
                  bgcolor: '#2196F3',
                  '&:hover': { bgcolor: '#42A5F5' },
                  '&:disabled': { bgcolor: 'rgba(33,150,243,0.2)', color: 'rgba(255,255,255,0.3)' },
                  minWidth: 140,
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Convert'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={handleDownload}
                disabled={!markdown || loading}
                sx={{
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'text.primary',
                  '&:hover': { borderColor: '#2196F3', color: '#2196F3' },
                  '&:disabled': { borderColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' },
                }}
              >
                Download .md
              </Button>
            </Box>
          </Paper>

          {/* Result */}
          {markdown && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'background.paper',
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 1.5,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  Result
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  {markdown.split('\n').length} lines
                </Typography>
              </Box>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 3,
                  bgcolor: '#0d1117',
                  color: '#e6edf3',
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  maxHeight: 480,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': { width: 6 },
                  '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
                }}
              >
                {markdown}
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
