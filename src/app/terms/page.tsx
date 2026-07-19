'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', color: '#ccc', padding: '60px 20px 120px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ fontSize: 12, color: '#555', marginBottom: 32 }}>Last updated: July 19, 2026</p>

        <div style={{ fontSize: 14, lineHeight: 1.8, color: '#aaa' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>1. Acceptance of Terms</h2>
          <p>By using Coduy ("the App"), you agree to these Terms of Use. If you do not agree, please do not use the App.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>2. Description of Service</h2>
          <p>Coduy is an interactive programming learning platform that provides lessons, quizzes, coding exercises, and gamified learning experiences. The App is available on web (coduy.sk, coduy.com) and iOS.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>3. Account Registration</h2>
          <p>You must create an account to use Coduy. You are responsible for maintaining the security of your account credentials. You agree to provide accurate information during registration.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>4. Coduy Pro Subscription</h2>
          <p><strong style={{ color: '#fff' }}>Free Tier:</strong> You can access a limited number of lessons for free.</p>
          <p><strong style={{ color: '#fff' }}>Coduy Pro:</strong> A paid subscription that unlocks all lessons, projects, arena battles, and premium features.</p>
          <p><strong style={{ color: '#fff' }}>Pricing:</strong> Monthly subscription at 3.99 EUR/month or yearly at 40.69 EUR/year. A trial period of 1 EUR for the first billing period is available.</p>
          <p><strong style={{ color: '#fff' }}>Cancellation:</strong> You can cancel your subscription at any time. Your access continues until the end of the current billing period. No refunds are provided for partial periods.</p>
          <p><strong style={{ color: '#fff' }}>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>5. Promo Codes</h2>
          <p>Promo codes may be issued at our discretion. They are non-transferable, cannot be exchanged for cash, and may have usage limits or expiration dates.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>6. User Content</h2>
          <p>You retain ownership of any code or content you create within the App. By using the App, you grant us a limited license to store and display your learning progress.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>7. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Use the App for any illegal purpose</li>
            <li>Attempt to access other users' accounts</li>
            <li>Interfere with the App's operation</li>
            <li>Copy, distribute, or sell lesson content</li>
            <li>Create multiple accounts to abuse free trials</li>
          </ul>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>8. Intellectual Property</h2>
          <p>All lesson content, illustrations, the Byte mascot, and app design are owned by Coduy. You may not reproduce, distribute, or create derivative works from our content without permission.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>9. Disclaimer of Warranties</h2>
          <p>The App is provided "as is" without warranties of any kind. We do not guarantee that the App will be error-free, uninterrupted, or that learning outcomes will be achieved.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>10. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Coduy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>11. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the new Terms.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>12. Governing Law</h2>
          <p>These Terms are governed by the laws of the Slovak Republic. Any disputes shall be resolved in the courts of the Slovak Republic.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 32, marginBottom: 12 }}>13. Contact</h2>
          <p>For questions about these Terms, contact us at support@coduy.sk.</p>
        </div>
      </div>
    </div>
  );
}
