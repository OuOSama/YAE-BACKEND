  # 📡 Broadcast Module
  
  Real-time service status broadcasting via WebSockets — keeping your frontend synced with backend events in milliseconds! ⚡✨
  
  ---
  
  ## 🔌 WebSocket Endpoint
  
  ```
  ws://localhost:3001/broadcast
  ```
  
  ---
  
  ## 📁 Module Structure
  
  | File                                                  | Purpose                                        |
  | ----------------------------------------------------- | ---------------------------------------------- |
  | **[index.ts](../../src/modules/broadcast/index.ts)**     | WebSocket server setup & event handlers        |
  | **[model.ts](../../src/modules/broadcast/model.ts)**     | Type-safe status models with Elysia validation |
  | **[service.ts](../../src/modules/broadcast/service.ts)** | Status cache & runtime type guards             |
  
  ---
  
  ## ✨ Features
  
  - 🔄 **Real-time broadcasting** — Publish status updates to all connected clients instantly
  - 💾 **Latest status cache** — New connections receive current state immediately
  - 🛡️ **Type-safe validation** — Runtime checks ensure data integrity
  - 🎯 **Channel-based pub/sub** — Clean subscription model via `broadcast` channel
  
  ---
  
  ## 🎮 How It Works
  
  ### Connection Flow
  
  ```
  Client connects → Subscribe to 'broadcast' → Receive latest status → Listen for updates
  ```
  
  ### Broadcasting Flow
  
  ```
  Service sends status → Validate & cache → Publish to all subscribers
  ```
  
  ---
  
  ## 📦 Status Model
  
  ```typescript
  {
    service_name: string,          // e.g. "auth-service", "db-monitor"
    status: "online" | "offline" | "running" | "error",
    timestamp: Date,
    message?: string              // Optional error/info message
  }
  ```
  
  ---
  
  ## 💻 Usage Example
  
  ### Backend (Broadcasting)
  
  ```typescript
  // Send status update
  ws.send(
    JSON.stringify({
      service_name: "yae-bot",
      status: "online",
      timestamp: new Date(),
      message: "Service started successfully",
    }),
  );
  ```
  
  ### Frontend (Receiving)
  
  ```typescript
  const ws = new WebSocket("ws://localhost:3001/broadcast");
  
  ws.onopen = () => {
    console.log("Connected to broadcast channel");
  };
  
  ws.onmessage = (event) => {
    const statuses = JSON.parse(event.data);
    console.log("Status updates:", statuses);
  };
  ```
  
  ---
  
  ## 🔗 Learn More
  
  - 📚 [Elysia WebSocket Documentation](https://elysiajs.com/patterns/websocket.html)
  - 🌐 [Bun WebSocket API Reference](https://bun.sh/docs/runtime/http/websockets)
  
  ---
  
  **Pro tip:** Use this module to build status dashboards, health monitors, or live activity feeds! Perfect for admin panels and real-time analytics. 📊💫
