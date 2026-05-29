import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Introduction',
    body: 'Anura Furniture – Dekatana (“we”) respects your privacy. This policy explains how we collect, use, and protect personal information when you use our website, create an account, place orders, or contact us.',
  },
  {
    title: '2. Information We Collect',
    body: 'We may collect: name, email, phone number, delivery address, order history, account preferences, messages sent via contact or custom order forms, and technical data (IP address, browser type, cookies) to operate and improve our site.',
  },
  {
    title: '3. How We Use Your Information',
    body: 'We use your data to process orders, arrange delivery, provide customer support, send order and account-related emails, improve our products and AI features, prevent fraud, and comply with legal obligations. We do not sell your personal information to third parties.',
  },
  {
    title: '4. Google Sign-In',
    body: 'If you sign in with Google, we receive your name, email, and profile picture from Google as permitted by your Google account settings. We store this to manage your account and link it to your orders.',
  },
  {
    title: '5. Cookies',
    body: 'We use cookies and similar technologies for authentication, shopping cart functionality, preferences (e.g. dark mode), and analytics. You can control cookies through your browser settings; some features may not work if cookies are disabled.',
  },
  {
    title: '6. Data Sharing',
    body: 'We may share data with: delivery partners (name, phone, address), email service providers (to send transactional emails), cloud hosting and image storage (e.g. Cloudinary), and AI service providers (e.g. Google Gemini) when you use AI features—only as needed to provide our services.',
  },
  {
    title: '7. Data Retention',
    body: 'We retain account and order data for as long as needed to provide services, resolve disputes, and meet legal requirements. You may request deletion of your account by contacting us, subject to records we must keep for tax or legal purposes.',
  },
  {
    title: '8. Security',
    body: 'We use industry-standard measures including encrypted connections (HTTPS), secure password hashing, and access controls. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.',
  },
  {
    title: '9. Your Rights',
    body: 'You may request access to, correction of, or deletion of your personal data where applicable under Sri Lankan law. Contact us using the details below. We will respond within a reasonable timeframe.',
  },
  {
    title: '10. Children',
    body: 'Our services are not directed at children under 16. We do not knowingly collect personal information from children.',
  },
  {
    title: '11. Changes',
    body: 'We may update this Privacy Policy from time to time. The “Last updated” date below indicates the latest version.',
  },
  {
    title: '12. Contact',
    body: 'Privacy questions: anurafurniture238@gmail.com, +94 72 330 3946, or our Contact page at Dekatana, Western Province, Sri Lanka.',
  },
];

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – Anura Furniture</title>
        <meta name="description" content="Privacy Policy for Anura Furniture – Dekatana." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8 text-cyan-300" />
              <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-blue-200">Last updated: May 29, 2026</p>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 py-12">
          <div className="card p-8 md:p-10 space-y-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              This Privacy Policy describes how Anura Furniture collects and uses personal information when you use our website and services.
            </p>

            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.body}</p>
              </section>
            ))}

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
              See also our{' '}
              <Link to="/terms" className="text-primary-700 dark:text-primary-400 hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
