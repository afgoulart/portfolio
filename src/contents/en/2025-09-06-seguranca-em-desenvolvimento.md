---
title: 'Security in Development: How to Protect Your Applications from the Code'
date: '2025-09-06'
author: Tech Blog Bot
tags:
  - security
  - development
  - devops
  - cybersecurity
  - secure-coding
excerpt: >-
  Discover the best practices for security in software development and how to
  implement a secure lifecycle for your applications
slug: seguranca-em-desenvolvimento
---

# Security in Development: How to Protect Your Applications from the Code

Security in applications has never been as critical as it is today. With the exponential increase in cyber attacks and data breaches, developers and technology teams need to integrate security practices from the very first lines of code. According to IBM reports, the average cost of a data breach in 2023 was $4.45 million, representing a 15% increase over three years.

The concept of "Security by Design" or "Shift Left Security" is no longer an option, but a fundamental necessity. This means that security must be considered from the beginning of the development cycle, not just as an additional layer implemented at the end of the process.

## 1. Fundamentals of Security in Development

### What is Secure Development Lifecycle (SDL)?

The Secure Development Lifecycle is a methodology that integrates security practices into each phase of software development. Unlike the traditional model where security is tested only at the end, SDL incorporates security checks from planning to maintenance.

### Main Pillars of Security in Development

**1. Principle of Least Privilege**
Each component, user, or process should have only the minimum permissions necessary to execute its functions. For example, a web application should not run with system administrator privileges.

**2. Defense in Depth**
Implement multiple layers of security so that if one fails, others still protect the system. This includes input validation, authentication, authorization, encryption, and monitoring.

**3. Fail Secure**
When something goes wrong, the system should fail securely, denying access instead of inadvertently granting it.

### Practical Example: Input Validation

```python
# Insecure code
def processar_usuario(user_input):
    query = f"SELECT * FROM users WHERE id = {user_input}"
    return execute_query(query)

# Secure code
def processar_usuario(user_input):
    if not user_input.isdigit():
        raise ValueError("ID must be numeric")
    
    query = "SELECT * FROM users WHERE id = %s"
    return execute_query(query, (int(user_input),))
```

## 2. OWASP Top 10: The Most Critical Vulnerabilities

### Understanding the OWASP Top 10 2021

OWASP (Open Web Application Security Project) maintains a list of the ten most critical security vulnerabilities in web applications. Knowing these vulnerabilities is essential for any developer.

**1. Broken Access Control**
Access control failures allow users to access unauthorized resources. In 2021, this vulnerability rose from 5th to 1st position.

**2. Cryptographic Failures**
Previously known as "Sensitive Data Exposure," it covers cryptography-related failures that can lead to sensitive data exposure.

**3. Injection**
Although it has dropped from 1st position, SQL, NoSQL, OS, and LDAP injections still represent significant risks.

### Real Use Case: Preventing SQL Injection

Imagine a login system where an attacker enters the following in the username field:
```
admin'; DROP TABLE users; --
```

If there's no adequate protection, this could execute malicious SQL commands. The solution is to use prepared statements:

```java
// Java - Prepared Statement
String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement stmt = connection.prepareStatement(sql);
stmt.setString(1, username);
stmt.setString(2, hashedPassword);
ResultSet rs = stmt.executeQuery();
```

### Tools for Automated Detection

- **SonarQube**: Static code analysis
- **OWASP ZAP**: Automated penetration testing
- **Snyk**: Vulnerability identification in dependencies
- **Checkmarx**: Source code security analysis

## 3. DevSecOps: Integrating Security in the Pipeline

### What is DevSecOps?

DevSecOps is the natural evolution of DevOps, where security is integrated into the continuous development and delivery pipeline. Instead of being an obstacle, security becomes an enabler of delivery speed.

### Implementing Security in CI/CD Pipeline

**1. Static Application Security Testing (SAST)**
Analysis of source code without executing it, identifying vulnerabilities during the development phase.

**2. Dynamic Application Security Testing (DAST)**
Tests the running application, simulating real attacks against the functioning application.

**3. Software Composition Analysis (SCA)**
Identifies vulnerabilities in third-party components and libraries.

### Example of GitLab CI Pipeline with Security

```yaml
stages:
  - test
  - security
  - deploy

unit_tests:
  stage: test
  script:
    - npm test

sast_scan:
  stage: security
  script:
    - docker run --rm -v $(pwd):/src sonarqube-cli
  
dependency_check:
  stage: security
  script:
    - npm audit --audit-level high
    
dast_scan:
  stage: security
  script:
    - docker run --rm owasp/zap2docker-stable zap-baseline.py -t $CI_ENVIRONMENT_URL
```

### Container Security

With the growing use of containers, containerized security has become crucial:

- **Image scanning**: Use tools like Trivy or Clair
- **Non-root user principle**: Run containers with low-privilege users
- **Secrets management**: Use tools like HashiCorp Vault or Azure Key Vault
- **Network policies**: Implement microsegmentation

```dockerfile
# Secure Dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001
USER nodeuser
WORKDIR /app
COPY --chown=nodeuser:nodejs package*.json ./
RUN npm ci --only=production
COPY --chown=nodeuser:nodejs . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 4. Best Practices and Essential Tools

### Security-Focused Code Review

Establish security checklists for code reviews:

- ✅ Input validation and sanitization
- ✅ Proper error handling
- ✅ Correct use of cryptographic functions
- ✅ Correct implementation of access control
- ✅ Adequate security logging

### Secrets Management

Never store credentials in source code:

```python
# Wrong
DATABASE_URL = "postgresql://user:password123@localhost/db"

# Correct
import os
DATABASE_URL = os.getenv('DATABASE_URL')
```

### Security Monitoring and Logging

Implement structured logs that capture security events:

```javascript
const winston = require('winston');

const securityLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'security.log',
      level: 'warn'
    })
  ]
});

// Log suspicious login attempt
securityLogger.warn('Suspicious login attempt', {
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString(),
  username: attemptedUsername
});
```

### Recommended Tools by Language

**JavaScript/Node.js:**
- ESLint with security plugins
- npm audit
- Helmet.js for security headers

**Python:**
- Bandit for static analysis
- Safety for dependency checking
- Django Security Scanner

**Java:**
- SpotBugs with FindSecBugs
- OWASP Dependency Check
- Checkmarx

## Conclusion

Security in development is not a destination, but a continuous journey that requires commitment from the entire team. Implementing security practices from the beginning of the development cycle not only protects data and users, but also reduces costs and accelerates the delivery of reliable software.

Key points for an effective security strategy in development include:

- **Continuous education**: Keep the team updated on the latest threats and practices
- **Automation**: Integrate security tools into the development pipeline
- **Security culture**: Make security everyone's responsibility, not just the security team's
- **Proactive monitoring**: Implement observability and incident response

Remember: it's much more economical and efficient to fix a vulnerability during development than after a successful attack. Invest in security from the first commit.

---

## Sources and References

1. [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
2. [IBM Cost of a Data Breach Report 2023](https://www.ibm.com/reports/data-breach)
3. [NIST Secure Software Development Framework](https://csrc.nist.gov/Projects/ssdf)
4. [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl/)
5. [SANS Secure Coding Practices](https://www.sans.org/white-papers/2172/)
6. [DevSecOps Manifesto](https://www.devsecops.org/)
