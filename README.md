# Auth Basics

Randall Degges Talk: Everything you ever wanted to know about authentication

- Basic Auth
- Password hashing with bcrypt
- Sessions with http cookies 
- Security Best Practices:
    - CSRF (Cross Site Requst Forgery)
    - Always use SSL/TLS!
    - Use cookie flags 
        - httpOnly: true (tells the browser to not allow any js code to access the cookie)
        - secure: true (only set cookies over https)
        - ephemeral: true (destroy cookies when the broser closes)
    - helmet library
  

Technologies:
- Node
- Express
- Pug as View Engine
- Mongogb/Mongoose
- client-sessions
- bcryptjs