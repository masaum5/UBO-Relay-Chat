import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Login } from "./user/Login";
import { Register } from "./user/Register";
import Messages from "./Messages";
import Conversation from "./Conversation";
import Header from "./Header";
import RoomConversation from "./RoomConversation";
import React, { useEffect } from "react";
import { Client as PushNotifications } from "@pusher/push-notifications-web";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!("Notification" in window)) {
      console.error("Notifications are not supported by this browser.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      console.log(`Notification permission: ${permission}`);
    });

    const beamsClient = new PushNotifications({
      instanceId: "bb7bb705-9890-428e-95ac-c04998af39da", // Replace with your Instance ID
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest("hello"))
      .then(() => console.log("Successfully registered and subscribed!"))
      .catch(console.error);
  }, []);

  const noHeaderRoutes = ["/login", "/register"];

  return (
    <>
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/messages" element={<Messages />}>
          <Route path="user/:id" element={<Conversation />} />
          <Route path="room/:id" element={<RoomConversation />} />
        </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
