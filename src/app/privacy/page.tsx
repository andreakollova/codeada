'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', color: '#ccc', padding: '60px 20px 120px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 12, color: '#555', marginBottom: 32 }}>Last updated: July 19, 2026</p>

        <div style={{ fontSize: 14, lineHeight: 1.8, color: '#aaa' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>1. Introduction</h2>
          <p>Coduy ("we", "our", "us") operates the Coduy mobile application and website (coduy.sk, coduy.com). This Privacy Policy explains how we collect, use, and protect your personal information.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>2. Information We Collect</h2>
          <p><strong style={{ color: '#fff' }}>Account Information:</strong> When you create an account, we collect your email address and display name. If you sign in with Google, we receive your name, email, and profile picture from Google.</p>
          <p><strong style={{ color: '#fff' }}>Usage Data:</strong> We collect information about your learning progress, completed lessons, quiz scores, XP points, and streak data to provide a personalized learning experience.</p>
          <p><strong style={{ color: '#fff' }}>Device Information:</strong> We may collect device type, operating system version, and app version for analytics and bug fixing purposes.</p>
          <p><strong style={{ color: '#fff' }}>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your credit card details. Stripe may collect payment information in accordance with their privacy policy.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Provide and improve the Coduy learning platform</li>
            <li>Track your learning progress and achievements</li>
            <li>Send you notifications about new content and learning reminders (with your permission)</li>
            <li>Process payments for Coduy Pro subscriptions</li>
            <li>Communicate with you about your account and service updates</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>4. Data Storage and Security</h2>
          <p>Your data is stored securely using Supabase (hosted on AWS in the EU region). We implement industry-standard security measures including encryption in transit (TLS) and at rest. Access to user data is restricted to authorized personnel only.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>5. Platforms and In-App Purchases</h2>
          <p>Coduy is available on the web (coduy.com, coduy.sk), Apple App Store (iOS) and Google Play Store (Android). When you subscribe to Coduy Pro:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li><strong style={{ color: '#fff' }}>On iOS:</strong> Payments are processed through Apple In-App Purchases. Apple manages billing and subscriptions according to their terms.</li>
            <li><strong style={{ color: '#fff' }}>On Android:</strong> Payments are processed through Google Play Billing. Google manages billing and subscriptions according to their terms.</li>
            <li><strong style={{ color: '#fff' }}>On Web:</strong> Payments are processed through Stripe. We do not store credit card details.</li>
          </ul>
          <p>You can manage or cancel subscriptions through your device settings (Apple: Settings → Apple ID → Subscriptions, Android: Play Store → Subscriptions) or through your Stripe account for web purchases.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>6. Push Notifications</h2>
          <p>With your permission, we send push notifications including daily glossary terms and learning reminders. You can disable notifications at any time in your device settings or in the Coduy app settings.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>7. Data Sharing</h2>
          <p>We do not sell your personal information. We share data only with:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li><strong style={{ color: '#fff' }}>Supabase</strong> - database and authentication provider</li>
            <li><strong style={{ color: '#fff' }}>Stripe</strong> - payment processing (web)</li>
            <li><strong style={{ color: '#fff' }}>Apple</strong> - in-app purchases and App Store distribution (iOS)</li>
            <li><strong style={{ color: '#fff' }}>Google</strong> - in-app purchases, Play Store distribution, authentication, Firebase Cloud Messaging</li>
            <li><strong style={{ color: '#fff' }}>Vercel</strong> - website hosting</li>
            <li><strong style={{ color: '#fff' }}>OpenAI</strong> - AI-powered features (Ask Coduy)</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p>To exercise these rights, contact us at support@coduy.sk.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>9. Children's Privacy</h2>
          <p>Coduy is designed for users of all ages who want to learn programming. We do not knowingly collect personal information from children under 13 without parental consent. If you believe a child under 13 has provided us with personal information, please contact us.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>10. Cookies and Tracking</h2>
          <p>We use essential cookies for authentication and session management. We use Vercel Analytics for anonymous usage statistics. We do not use third-party advertising trackers.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by email.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>12. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p>Email: support@coduy.sk</p>
          <p>Website: coduy.sk</p>
        </div>
      </div>
    </div>
  );
}
