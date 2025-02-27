# Laravel WebRTC with Reverb & Echo

This project integrates **WebRTC** with **Laravel Reverb** and **Laravel Echo**, enabling real-time peer-to-peer communication using Laravel's native WebSocket capabilities.

## Features

- **Real-Time Communication**: Uses **WebRTC** for live audio and video calls.
- **WebSockets with Laravel Reverb**: Provides scalable and low-latency signaling for WebRTC.
- **Laravel Echo Integration**: Handles WebSocket events seamlessly.
- **Vue.js Frontend**: A dynamic and interactive UI built with Vue.js.
- **Self-Hosted WebSocket Server**: No need for third-party WebSocket services.

## Prerequisites

- **PHP 8+**  
- **Laravel 10+**  
- **Composer**  
- **Node.js & npm**  
- **SQLite, MySQL, or PostgreSQL**  

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mastashake08/laravel-webrtc.git
   cd laravel-webrtc
   ```

2. **Install Dependencies**:

   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration**:

   - Duplicate `.env.example` and rename it to `.env`.
   - Update your database settings.
   - Set the WebSockets connection driver:

     ```ini
     BROADCAST_DRIVER=pusher
     PUSHER_APP_ID=reverb
     PUSHER_APP_KEY=reverb
     PUSHER_APP_SECRET=reverb
     ```

   - Generate an application key:

     ```bash
     php artisan key:generate
     ```

4. **Run Database Migrations**:

   ```bash
   php artisan migrate
   ```

5. **Start Laravel Reverb (WebSocket Server)**:

   ```bash
   php artisan reverb:start
   ```

6. **Start the Laravel Application**:

   ```bash
   php artisan serve
   ```

7. **Compile Frontend Assets**:

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm run build
   ```

## WebRTC Signaling Flow

1. **User joins a call** → Laravel Echo broadcasts an event via Reverb.  
2. **New peer detected** → WebRTC initiates a peer-to-peer connection.  
3. **ICE Candidates exchanged** → STUN/TURN servers handle NAT traversal.  
4. **Media streams established** → Users can see and hear each other.

## Configuration for Laravel Echo

Your `resources/js/bootstrap.js` should have the following:

```javascript
import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'reverb',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});
```

## Usage

1. Open two different browser windows (or devices).
2. Start a call and invite the other participant.
3. Laravel Reverb will handle WebSocket signaling.
4. WebRTC will establish the peer-to-peer connection.

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

## License

This project is open-source under the [MIT License](LICENSE).

---
