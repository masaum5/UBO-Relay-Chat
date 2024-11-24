import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Box, Container, Typography, Divider, CircularProgress } from "@mui/material";
import UserList from "./components/UserList";
import RoomList from "./components/RoomList";

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [userError, setUserError] = useState(null);
  const [roomError, setRoomError] = useState(null);
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refresh_token");
      if (!refreshToken) {
        navigate("/login");
        return null;
      }

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        navigate("/login");
        return null;
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      navigate("/login");
      return null;
    }
  };

  const fetchData = async (endpoint, setData, setError, setLoading) => {
    try {
      let token = sessionStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.status === 401) {
        console.warn("Token expired. Refreshing...");
        token = await refreshAccessToken();
        if (!token) {
          setError("Session expirée. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }
        return fetchData(endpoint, setData, setError, setLoading); // Retry fetch
      }

      if (!response.ok) {
        setError("Impossible de récupérer les données.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setData(data);
      setError(null);
    } catch (error) {
      setError("Erreur lors du chargement des données.");
      console.error("API error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("/api/users", setUsers, setUserError, setIsLoadingUsers);
    fetchData("/api/rooms", setRooms, setRoomError, setIsLoadingRooms);
  }, []);

  const handleUserSelect = (userId) => navigate(`/messages/user/${userId}`);
  const handleRoomSelect = (roomId) => navigate(`/messages/room/${roomId}`);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", marginTop: "20px" }}>
      <Box sx={{ width: "25%", paddingRight: 2, borderRight: "1px solid #ddd" }}>
        <Typography variant="h6">Utilisateurs</Typography>
        {isLoadingUsers ? (
          <CircularProgress />
        ) : userError ? (
          <Typography color="error">{userError}</Typography>
        ) : users.length === 0 ? (
          <Typography>Aucun utilisateur trouvé.</Typography>
        ) : (
          <UserList users={users} onUserSelect={handleUserSelect} />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Salons</Typography>
        {isLoadingRooms ? (
          <CircularProgress />
        ) : roomError ? (
          <Typography color="error">{roomError}</Typography>
        ) : rooms.length === 0 ? (
          <Typography>Aucun salon disponible.</Typography>
        ) : (
          <RoomList rooms={rooms} onRoomSelect={handleRoomSelect} />
        )}
      </Box>

      <Box sx={{ flex: 1, marginLeft: 2, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Messages;
