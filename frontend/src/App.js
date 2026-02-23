import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CloudUpload, FileDownload, AutoAwesome } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' },
    background: { default: '#f0f9ff', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
      },
    },
  },
});

const API_URL = process.env.REACT_APP_API_URL || 'https://mark-down-container.jollymeadow-0111d26b.westus2.azurecontainerapps.io';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(14, 165, 233, 0.15)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(14, 165, 233, 0.08)',
};

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
    if (dropped) { setFile(dropped); setMarkdown(''); }
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

      {/* Light gradient background */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #ecfeff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: 'absolute', top: '-8%', left: '-4%',
          width: 450, height: 450, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '-8%', right: '-4%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: '40%', right: '10%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Main glass card */}
        <Box sx={{ ...glassStyle, p: 4, width: '100%', maxWidth: 580, position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 60, height: 60, borderRadius: '18px', mb: 2,
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              boxShadow: '0 8px 20px rgba(14,165,233,0.3)',
            }}>
              <AutoAwesome sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#0f172a', mb: 0.5 }}>
              Document to Markdown
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Convert your documents to clean Markdown in seconds
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Supports PDF, DOCX, PPTX and more — powered by Azure AI
            </Typography>
          </Box>

          {/* Drop zone */}
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${dragging ? '#0ea5e9' : '#bae6fd'}`,
              borderRadius: '16px',
              p: 4,
              mb: 3,
              textAlign: 'center',
              background: dragging ? 'rgba(14,165,233,0.06)' : 'rgba(240,249,255,0.8)',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
            }}
          >
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: '14px', mb: 1.5,
              background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(6,182,212,0.12))',
              border: '1px solid rgba(14,165,233,0.2)',
            }}>
              <CloudUpload sx={{ color: '#0ea5e9', fontSize: 24 }} />
            </Box>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#0f172a', mb: 0.5 }}>
              {file ? file.name : 'Drop your file here'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              {file ? 'Ready to convert' : 'or click to browse your files'}
            </Typography>
            <Button
              component="label"
              size="small"
              sx={{
                background: 'rgba(14,165,233,0.08)',
                color: '#0ea5e9',
                border: '1px solid rgba(14,165,233,0.25)',
                px: 2.5, py: 0.75,
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                '&:hover': { background: 'rgba(14,165,233,0.15)' },
              }}
            >
              Browse
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleConvert}
              disabled={!file || loading}
              disableElevation
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                color: '#fff',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284c7, #0891b2)',
                  boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#0ea5e9' }} /> : 'Convert'}
            </Button>

            <Button
              fullWidth
              startIcon={<FileDownload />}
              onClick={handleDownload}
              disabled={!markdown || loading}
              sx={{
                py: 1.5,
                background: '#fff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
                fontWeight: 600,
                '&:hover': {
                  background: '#f8fafc',
                  borderColor: '#0ea5e9',
                  color: '#0ea5e9',
                },
                '&:disabled': {
                  background: '#f8fafc',
                  color: '#cbd5e1',
                  borderColor: '#f1f5f9',
                },
              }}
            >
              Download .md
            </Button>
          </Box>

          {/* Result */}
          {markdown && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(14,165,233,0.06)',
              }}>
                <Box sx={{
                  px: 2.5, py: 1.5,
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center',
                  background: '#f8fafc',
                }}>
                  <Box sx={{ display: 'flex', gap: 0.75, mr: 2 }}>
                    {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                      <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                    output.md
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {markdown.split('\n').length} lines
                  </Typography>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    m: 0, p: 2.5,
                    background: '#ffffff',
                    color: '#1e293b',
                    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                    fontSize: '0.8rem',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    maxHeight: 400,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { width: 5 },
                    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 3 },
                  }}
                >
                  {markdown}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
