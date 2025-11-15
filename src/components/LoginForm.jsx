import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  CssBaseline,
  Fade,
  GlobalStyles,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LockOutlined } from "@mui/icons-material";
import { API_BASE } from "../config";
import theme from "../theme";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "html, body, #root": {
            height: "100%",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%)",
          filter: "blur(80px)",
          transform: "scale(1.2)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          height: "100dvh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          zIndex: 1,
        }}
      >
        <Fade in timeout={600}>
          <Paper
            component="form"
            onSubmit={submit}
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 420,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 1,
                }}
              >
                <LockOutlined />
              </Avatar>
              <Typography variant="h5" fontWeight={600}>
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your username and password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              autoFocus
              required
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.2,
                fontSize: "1rem",
                borderRadius: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Paper>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
