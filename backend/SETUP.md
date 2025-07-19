# MaskMe Setup Guide

## Environment Configuration

### For Local Development

The app is configured to work with `localhost` by default.

### For Mobile/Network Access

To make the app accessible from mobile devices or other computers on your network:

1. **Find your computer's IP address:**

   - **Windows:** Run `ipconfig` in CMD
   - **Mac/Linux:** Run `ifconfig` or `ip addr` in terminal
   - Look for your local IP (usually starts with `192.168.x.x` or `10.0.x.x`)

2. **Set environment variables:**

   ```bash
   # Windows CMD
   set FRONTEND_URL=http://YOUR_IP_ADDRESS:3000
   set BACKEND_URL=http://YOUR_IP_ADDRESS:5000

   # Windows PowerShell
   $env:FRONTEND_URL="http://YOUR_IP_ADDRESS:3000"
   $env:BACKEND_URL="http://YOUR_IP_ADDRESS:5000"

   # Mac/Linux
   export FRONTEND_URL=http://YOUR_IP_ADDRESS:3000
   export BACKEND_URL=http://YOUR_IP_ADDRESS:5000
   ```

3. **Start the servers:**

   ```bash
   # Backend (from backend directory)
   npm start

   # Frontend (from frontend directory, in a new terminal)
   npm start
   ```

4. **Access from mobile:**
   - Make sure your phone is on the same WiFi network
   - Open browser and go to: `http://YOUR_IP_ADDRESS:3000`

### For Production Deployment

Set these environment variables on your hosting platform:

```bash
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
JWT_SECRET=your-secure-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DATABASE_URL=your-mongodb-connection-string
```

### Example IP Addresses

- **Local development:** `http://localhost:3000`
- **Network access:** `http://192.168.1.100:3000`
- **Production:** `https://maskme.com`

### Troubleshooting

1. **Can't access from mobile:**

   - Check firewall settings
   - Ensure both devices are on same network
   - Try using your computer's IP address instead of localhost

2. **Email verification not working:**

   - Check that `FRONTEND_URL` is set correctly
   - Verify the URL is accessible from the device opening the email

3. **CORS errors:**
   - Make sure `BACKEND_URL` matches your frontend's API calls
   - Check that the backend is configured to accept requests from the frontend URL
