package com.lpt.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final String fromEmail;
    private final String appPassword;

    public EmailService(
            @Value("${spring.mail.username:}") String fromEmail,
            @Value("${spring.mail.password:}") String appPassword) {
        this.fromEmail = fromEmail;
        this.appPassword = appPassword;
    }

    public void sendWelcomeEmail(String toEmail, String fullname) {
        try {
            if (fromEmail == null || fromEmail.isBlank()
                    || appPassword == null || appPassword.isBlank()
                    || fromEmail.equals("your_email@gmail.com")
                    || appPassword.equals("your_app_password")) {
                return;
            }
            // Add spring-boot-starter-mail back when Maven Central is reachable, then send buildWelcomeHtml(fullname).
        } catch (Exception ignored) {
            // Registration must not fail just because email delivery failed.
        }
    }

    private String buildWelcomeHtml(String fullname) {
        String safeName = fullname == null || fullname.isBlank() ? "Learner" : fullname;
        return """
                <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:24px;">
                  <div style="max-width:620px;margin:auto;background:white;border-radius:18px;overflow:hidden;box-shadow:0 14px 40px rgba(15,23,42,.16);">
                    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;color:white;text-align:center;">
                      <h1 style="margin:0;font-size:30px;">LearnTrack</h1>
                      <p style="margin:8px 0 0;">Your progress tracker is ready</p>
                    </div>
                    <div style="padding:30px;color:#1f2937;">
                      <h2>Hey %s!</h2>
                      <h3 style="color:#16a34a;">Registration Successful!</h3>
                      <p style="line-height:1.7;font-size:16px;">Let's goo kiddo! All the best for your learning journey! Be consistent, be successful!</p>
                      <div style="margin:24px 0;padding:18px;border-left:5px solid #667eea;background:#eef2ff;border-radius:12px;">
                        <strong>The expert in anything was once a beginner. Keep going!</strong>
                      </div>
                      <p>From the LearnTrack Team</p>
                    </div>
                    <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:16px;text-align:center;color:white;font-size:13px;">
                      Keep learning. Keep winning.
                    </div>
                  </div>
                </div>
                """.formatted(safeName);
    }
}
