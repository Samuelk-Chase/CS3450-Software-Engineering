# Security Design
This document was generated with the assistance of ChatGPT, which provided efficient and well-structured explanations for our chosen security measures. It helped articulate our reasoning more clearly and concisely than I could have expressed on my own, ensuring a thorough and well-documented approach to our security design.
## Authentication and Authorization
To secure user accounts and prevent unauthorized access, the game will implement **OAuth** for authentication. This approach offers a secure, industry-standard way to manage login credentials while ensuring user data protection. Key aspects of authentication include:

- **OAuth Implementation:** Users will log in via trusted third-party authentication providers (e.g., Google, Microsoft, Discord, Steam). OAuth is chosen because it reduces the need for the game to store and manage sensitive passwords directly, offloading security concerns to well-established authentication providers.
- **Token-Based Authentication:** After successful login, a short-lived **access token** will be issued, while a refresh token can be used to maintain session continuity. This ensures that users remain logged in without repeatedly entering their credentials while keeping authentication secure.
- **Two-Factor Authentication (2FA):** For additional security, users may enable **2FA** via email or authentication apps. This will only be considered if sensitive user data is collected, as it adds another layer of protection against unauthorized access, particularly for high-value accounts.

## Data Protection & Privacy
User privacy and secure data handling are a priority. The game will adhere to industry best practices for **encryption, storage, and compliance** with data protection regulations.

- **Password Protection:** User passwords will be **hashed and salted** using a strong hashing algorithm if OAuth is not used. This ensures that even if the database is compromised, attackers cannot easily retrieve user passwords.
- **Encryption of Sensitive Data:** All personally identifiable information (**PII**) and game-related data stored in the database will be encrypted (should the team deem necessary). Encryption protects user data from unauthorized access, ensuring compliance with security best practices.
- **Anonymized Analytics:** User analytics data will be **aggregated and anonymized** before being stored for business analysis, ensuring compliance with **GDPR and CCPA**. This ensures that user data is not personally identifiable while still allowing valuable insights for improving the game.
- **Secure Communication:** All client-server interactions will use **TLS 1.3 encryption** to protect against eavesdropping and man-in-the-middle attacks. TLS 1.3 was chosen because it is the latest and most secure; while this is just a game, TLS 1.3 was also a solid option because it only uses **1 round trip instead of 2**, making it **faster**, which may be useful in a multiplayer game.

## Mitigating Common Attacks
The game must be resilient against various forms of cyber threats that can disrupt gameplay or compromise user data.

### 1. DDoS Protection
Distributed Denial of Service (DDoS) attacks can overload game servers, causing latency issues or service disruptions. To mitigate this:

- **Rate Limiting & Throttling:** API requests and multiplayer actions will be **rate-limited** to prevent excessive requests from a single source. This helps mitigate bot-driven traffic spikes that could degrade performance.
- **Traffic Monitoring & IP Filtering:** Traffic will be monitored using **behavioral analysis and anomaly detection** to identify and block suspicious activity. This helps detect large-scale bot-driven attacks before they affect gameplay.
- **CDN & Load Balancing:** A **Content Delivery Network (CDN)** will distribute game data efficiently, while **load balancing** ensures traffic is handled evenly across multiple servers. This helps prevent any single server from being overwhelmed.


### 2. SQL Injection & Input Validation
Malicious actors may attempt to manipulate game database queries via SQL injection. Preventative measures include:

- **Parameterized Queries & ORM (Object-Relational Mapping):** Instead of raw SQL, an ORM (e.g., SQLAlchemy, Django ORM) will be used to sanitize user input. This eliminates the risk of attackers injecting malicious SQL commands.
- **Strict Input Validation:** All user inputs (e.g., usernames, chat messages, deck names) will be **validated and sanitized** before processing. This ensures that only properly formatted input is accepted, reducing the risk of injection attacks.

### 3. Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)
To prevent unauthorized script execution and malicious actions via the web interface:

- **Content Security Policy (CSP):** Restricts execution of inline scripts and untrusted external sources. This prevents attackers from injecting harmful scripts into the game.
- **CSRF Tokens:** Every authenticated request requiring user action will include **unique CSRF tokens** to prevent unauthorized actions from malicious websites. This ensures that only requests originating from authorized users are accepted.

### 4. Account Takeovers & Brute Force Attacks
To prevent attackers from guessing login credentials:

- **Account Lockouts & CAPTCHA:** After a certain number of failed login attempts, the system will **lock the account temporarily** and require a CAPTCHA verification. This makes it more difficult for attackers to use automated scripts to guess passwords.
- **IP Monitoring:** Repeated failed login attempts from a single IP will trigger **temporary bans** to deter brute-force attacks. This helps prevent attackers from systematically guessing login credentials.

## Secure Multiplayer & Fair Play
Since the game features **multiplayer components**, additional security measures are needed to **prevent cheating, exploits, and unauthorized modifications.**

- **Server-Side Game Logic Validation:** All crucial game logic (e.g., deck-building, in-game purchases, again in game purchases will be decided apon later by team) will be validated **on the server**, preventing client-side tampering. This ensures that users cannot manipulate game data on their own devices.
- **Cheat Detection Algorithms:** Player behavior will be **analyzed for anomalies**, such as **impossible win rates, artificially inflated resources, or modified game files.** This allows us to detect and prevent cheating.
- **Secure WebSocket Connections:** Multiplayer communication will use **secure WebSocket connections** with end-to-end encryption to prevent interception. This ensures that player interactions remain private and tamper-proof.

## Disaster Recovery & Incident Response
A well-defined **disaster recovery plan** ensures security incidents are handled effectively:

- **Automated Backups:** Game data will be backed up **daily** with encrypted storage. This ensures that data can be restored in the event of a failure.
- **Incident Detection & Alerts:** Security incidents will trigger **real-time alerts**, allowing administrators to respond quickly. This ensures that any security threats are addressed as soon as they arise.
- **Post-Incident Audits:** All security events will be **logged** and **audited** to improve future security measures. This helps refine security strategies and prevent similar issues in the future.

## Conclusion
The security strategy outlined above ensures **robust protection against cyber threats** while maintaining a seamless user experience. By incorporating **OAuth authentication, encryption, DDoS protection, and anti-cheat measures,** the game will be resilient to attacks, safeguarding both user data and gameplay integrity.