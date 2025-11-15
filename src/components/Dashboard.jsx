import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  Button,
  Divider,
  Grid,
  CssBaseline,
  Fade,
  GlobalStyles,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { API_BASE } from "../config";
import theme from "../theme";

export default function Dashboard({ token, onLogout = () => {} }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(API_BASE + "api/dashboard/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error("Not authenticated");
          const j = await res.json().catch(() => ({}));
          throw new Error(j.detail || "Failed to load dashboard");
        }
        const j = await res.json();
        if (mounted) setData(j);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  async function logout() {
    try {
      await fetch(API_BASE + "api/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } finally {
      localStorage.removeItem("token");
      onLogout();
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
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 700,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              overflowY: "auto",
              maxHeight: "90dvh",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 56,
                    height: 56,
                  }}
                >
                  {data?.first_name?.[0]?.toUpperCase() ||
                    data?.username?.[0]?.toUpperCase() ||
                    "U"}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {data?.first_name && data?.last_name
                      ? `${data.first_name} ${data.last_name}`
                      : data?.username || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{data?.username || "unknown"}
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={logout}
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Logout
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : data ? (
              <>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Account Information
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1">
                      {data.username || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {data.email || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography variant="body1">
                      {data.first_name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography variant="body1">
                      {data.last_name || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>

                {data.ldap_info && Object.keys(data.ldap_info).length > 0 && (
                  <>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      LDAP Information
                    </Typography>

                    <Grid container spacing={2}>
                      {Object.entries(data.ldap_info).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Typography variant="body2" color="text.secondary">
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, " $1")}
                          </Typography>
                          <Typography variant="body1">
                            {value || "N/A"}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </>
            ) : (
              <Typography sx={{ mt: 2 }}>No data available</Typography>
            )}
          </Paper>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
