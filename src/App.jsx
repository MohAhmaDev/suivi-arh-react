import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import theme from "./theme";
import { API_BASE } from "./config.js";

function App() {
  const [, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const validatingRef = useRef(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (validatingRef.current) {
      return;
    }

    validatingRef.current = true;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      let mounted = true;

      try {
        const res = await fetch(API_BASE + "api/auth/dashboard/", {
          headers: { Authorization: `Token ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          if (mounted) setToken(null);
        } else {
          const j = await res.json();
          if (mounted) setUser({ username: j.username });
        }
      } catch (e) {
        localStorage.removeItem("token");
        if (mounted) setToken(null);
      } finally {
        validatingRef.current = false;
      }

      return () => {
        mounted = false;
      };
    }, 300);

    return () => {
      clearTimeout(debounceTimerRef.current);
      validatingRef.current = false;
    };
  }, [token]);

  function handleLogin(data) {
    setToken(data.token);
    setUser({
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
    });
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        {!token ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Dashboard token={token} onLogout={handleLogout} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
