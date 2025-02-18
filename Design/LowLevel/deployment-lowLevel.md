# Deployment - Low Level Design

This document outlines the deployment strategy for our AI-driven roguelike game. The backend server will be hosted on an AWS EC2 instance, with Supabase handling authentication and database storage. The deployment process ensures high availability, zero-downtime updates, and secure communication using Cloudflare Origin Certificates.

Additionally, AI models will be accessed via [Fireworks](https://fireworks.ai) for various in-game features. Generated images will be stored in an AWS S3 bucket for efficient retrieval.

## Infrastructure setup

### EC2 Instance configuration
*   Instance type: t2.micro (for initial deployment because it is free. We can easily scale up if we require extra compute resources later)
*   Operating sytem: Ubuntu 22.04 LTS
*   Networking:
    *   Security group allowing TCP traffic on ports 22 and 443
        *   22 for SSH   
        *   443 for HTTPS
        *   No 80 for HTTP because this backend will act as an API. Clients attempting to connect via HTTP will be rejected.
*   Persistent storage: 20GB
    *   Nothing extra should be stored on the EC2

### Nginx configuration
*   Installed via `sudo apt install nginx`
*   Configured to:
    *   Terminate TLS using Cloudflare Origin Certificates
    *   Reverse proxy traffic to the game server
    *   Support blue-green deployment (switching between server versions seamlessly)

### AI Integration via Fireworks
*   AI Models: Accessed via Fireworks API for in-game mechanics and interactions.
*   Image Generation: Fireworks will be used to generate in-game images dynamically.
*   Storage: AI-generated images will be stored in an AWS S3 bucket for fast access.
*   Security: S3 permissions will be managed using IAM policies to restrict unauthorized access.

### S3 Bucket Configuration
*   Bucket Name: ai-roguelike-game-images
*   Region: us-west-2
*   Storage Class: STANDARD
*   Permissions:
    *   Private by default.
    *   IAM policy restricting access to authorized roles.
    *   Pre-signed URLs used for controlled access.
*   Lifecycle Rules:
    *   Retain images for 90 days before automatic deletion.
    *   Move unused images to GLACIER storage after 30 days.

## Deployment process

### Initial setup
1.  SSH into the EC2 instance
    ```bash
    ssh gameuser@ec2-instance-ip
    ```
2.  Install dependencies:
    ```bash
    sudo apt update && sudo apt install -y nginx git unzip
    ```
3.  Set up the working directory:
    ```bash
    mkdir -p /home/gameuser/game && cd /home/gameuser/game
    ```
4.  Install Cloudflare Origin Certificates:
    ```bash
    sudo cp origin.pem /etc/nginx/cloudflare-origin.crt
    sudo cp private.pem /etc/nginx/cloudflare-origin.key
    ```
### Blue-Green Deployment Strategy
*   The game server binary is deployed as either game_server_A or game_server_B.
*   Nginx routes traffic to the active binary while keeping the other on standby.
*   A health check ensures the new binary is functional before switching traffic.   

**Systemd Service Configuration**

`/etc/systemd/system/game.service`:
```systemd
[Unit]
Description=AI Roguelike Game Server
After=network.target

[Service]
User=gameuser
Group=gameuser
WorkingDirectory=/home/gameuser/game
ExecStart=/home/gameuser/game/current_game_binary --env /etc/last_game.env
Restart=always
EnvironmentFile=/etc/last_game.env

[Install]
WantedBy=multi-user.target
```

**Nginx Configuration**

`/etc/nginx/sites-available/game`:
```nginx
upstream game_backend {
    server 127.0.0.1:8080 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:8081 backup;  # New version (inactive until promoted)
}

server {
    listen 443 ssl;
    server_name api.our-domain.com;

    ssl_certificate /etc/nginx/cloudflare-origin.crt;
    ssl_certificate_key /etc/nginx/cloudflare-origin.key;

    location / {
        proxy_pass http://game_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

