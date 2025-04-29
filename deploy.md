# Trust Indicator Service Deployment Guide

## 1. Cloud Server Access Information

### Server Management Console
- **Provider Website**: [bandwagonhost.com](https://bandwagonhost.com)
- **Login Instructions**:
  1. Go to `Client Area`
  2. Select `Services/My Services`
  3. Click `Manage/Open KiwiVM`

### Critical Server Information
- **Public IP Address**: Viewable in KiwiVM panel
- **SSH Port**: Non-standard port (not 22), check KiwiVM panel
- **root Password**: xxxx (replace with actual password)
- **Password Reset**: Can reset root password via KiwiVM panel

## 2. User Accounts

### Recommended User
- **Username**: user-ti
- **Password**: xxxx (replace with actual password)
- **Privileges**: Has sudo access but with restrictions on root account operations

### Login Method
```bash
ssh -p [SSH Port] user-ti@[Server IP]
```

## 3. Service Deployment Process

### Environment Setup
1. Clone repository
```bash
git clone [Repo URL] ~/Trust-Indicator
cd ~/Trust-Indicator
```

2. Create and activate Python virtual environment
```bash
python -m venv .venv
source .venv/bin/activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

### Persistent Operation with Screen
```bash
# Create new screen session
screen -S trust-indicator

# Start service within screen session
source .venv/bin/activate
python app.py

# Detach screen session (Ctrl+A, D)
```

### Screen Session Management
```bash
# View existing sessions
screen -ls

# Reattach session
screen -r trust-indicator

# Terminate session (from within session)
exit
```

## 4. Caddy Reverse Proxy Configuration

### Current Configuration
- Configured to proxy `http(80)` and `https(443)` traffic to local `5000` port
- Config file location: `/etc/caddy/Caddyfile`

### Common Commands
```bash
# Check Caddy status
sudo systemctl status caddy

# Restart Caddy
sudo systemctl restart caddy

# View logs
sudo journalctl -u caddy -f
```

## 5. Service Maintenance

### Restart After Updates
1. Pull latest code
```bash
cd ~/Trust-Indicator
git pull
```

2. Restart service
```bash
# Find running screen session
screen -ls

# Connect to session
screen -r trust-indicator

# Stop current instance (Ctrl+C)
# Restart
python app.py

# Detach session (Ctrl+A, D)
```

### Service Status Check
```bash
# Check Python processes
ps aux | grep app.py

# Check network ports
ss -tulnp | grep -E '5000|80|443'
```

## 6. Emergency Procedures

### Forgotten Screen Session ID
```bash
screen -ls
# Reattach using displayed ID, e.g.:
screen -r 12345.trust-indicator
```

### Service Startup Failure
1. Check Python dependencies
```bash
source .venv/bin/activate
pip check
```

2. Check application logs
```bash
# If log files exist, check latest entries
tail -f logs/app.log
```

## 7. Security Considerations

1. Regularly change user-ti password
2. Never document root password in public files
3. All production passwords should be shared through secure channels
4. Regularly check for Caddy and system security updates
