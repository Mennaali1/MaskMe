export const html = (mailToken, baseUrl = "http://localhost:3000") => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - MaskMe</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8fafc;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 10px;
    }
    
    .tagline {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      font-weight: 500;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 24px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 20px;
    }
    
    .message {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    
    .verify-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .verify-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 30px 0;
    }
    
    .security-note {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    
    .security-title {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
    
    .security-icon {
      margin-right: 8px;
      font-size: 16px;
    }
    
    .security-text {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.6;
    }
    
    .footer {
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer-text {
      font-size: 14px;
      color: #718096;
      margin-bottom: 15px;
    }
    
    .footer-links {
      font-size: 14px;
      color: #667eea;
    }
    
    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 10px;
        border-radius: 8px;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .greeting {
        font-size: 20px;
      }
      
      .verify-button {
        padding: 14px 28px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">MaskMe</div>
      <div class="tagline">Anonymous Questions, Real Answers</div>
    </div>
    
    <div class="content">
      <div class="greeting">Welcome to MaskMe! 🎉</div>
      
      <div class="message">
        Thank you for joining our community of anonymous question-askers! To get started and unlock all features, please verify your email address by clicking the button below.
      </div>
      
      <div class="button-container">
        <a href="${baseUrl}/user/verify/${mailToken}" class="verify-button">
          Verify Email Address
        </a>
      </div>
      
      <div class="security-note">
        <div class="security-title">
          <span class="security-icon">🔒</span>
          Security Notice
        </div>
        <div class="security-text">
          This verification link will expire in 24 hours. If you didn't create a MaskMe account, you can safely ignore this email and no account will be created.
        </div>
      </div>
      
      <div class="message">
        Once verified, you'll be able to:
        <ul style="margin-top: 10px; margin-left: 20px; color: #4a5568;">
          <li>Ask questions anonymously to anyone</li>
          <li>Receive and answer questions from others</li>
          <li>Track your question history privately</li>
          <li>Enjoy complete privacy and anonymity</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        Questions? We're here to help!
      </div>
      <div class="footer-links">
        <a href="mailto:support@maskme.com">Contact Support</a>
        <span>•</span>
        <a href="${baseUrl}">Visit MaskMe</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};
