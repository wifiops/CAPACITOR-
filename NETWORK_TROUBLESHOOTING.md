# Network Error Troubleshooting Guide

## Why This Error Occurs

The Web Speech API sends your audio to Google's servers for processing. If you see "Network error", it means your browser cannot reach Google's speech recognition servers.

## Quick Checks

### 1. **Verify Internet Connection**
- Open a new tab and visit: https://www.google.com
- If Google doesn't load, you have no internet connection
- **Fix**: Connect to the internet

### 2. **Check Browser Console**
- Press F12 → Console tab
- Look for any blocked requests or CORS errors
- Check Network tab to see if requests to Google are being blocked

### 3. **Firewall/VPN Issues**
- If you're on a corporate network, firewall might block Google's servers
- VPN might be blocking or routing incorrectly
- **Fix**: 
  - Try disabling VPN temporarily
  - Try a different network (mobile hotspot)
  - Contact IT if on corporate network

### 4. **Browser Settings**
- Some browsers block third-party requests
- Check browser privacy/security settings
- **Fix**: 
  - Try Chrome or Edge (best support)
  - Check if extensions are blocking requests
  - Try incognito/private mode

### 5. **Test Network Connectivity**
Open browser console (F12) and run:
```javascript
fetch('https://www.google.com')
  .then(() => console.log('Internet: OK'))
  .catch(() => console.log('Internet: FAILED'))
```

## Alternative Solutions

If network issues persist, you might need:
1. **Different network** - Try mobile hotspot
2. **Different browser** - Chrome/Edge work best
3. **Check with IT** - If on corporate network
4. **Wait and retry** - Sometimes temporary network issues

## Status Messages

- ✅ "Ready to dictate" - Everything OK
- ❌ "Network error" - No internet or blocked
- ❌ "Microphone permission denied" - Need to allow mic access
- ❌ "No microphone found" - No mic connected

