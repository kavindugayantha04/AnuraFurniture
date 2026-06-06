import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { formatLongDate, POLICY_LAST_UPDATED } from '../utils/dates';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using the Anura Furniture website, mobile application, or services, you agree to these Terms of Service. If you do not agree, please do not use our platform.',
  },
  {
    title: '2. About Anura Furniture',
    body: 'Anura Furniture – Dekatana (“we”, “us”, “our”) operates an online and showroom furniture business in Sri Lanka. We sell furniture, accept custom orders, and provide related services through anurafurniture.lk and associated channels.',
  },
  {
    title: '3. Accounts',
    body: 'You must provide accurate information when creating an account. You are responsible for keeping your password secure and for all activity under your account. We may suspend accounts that violate these terms or engage in fraud or abuse.',
  },
  {
    title: '4. Orders & Pricing',
    body: 'All prices are listed in Sri Lankan Rupees (LKR) unless stated otherwise. We reserve the right to correct pricing errors. An order is confirmed only after you receive an order confirmation email or notification. We may refuse or cancel orders at our discretion (e.g. stock unavailability, suspected fraud).',
  },
  {
    title: '5. Payment',
    body: 'Orders are paid by cash on delivery unless otherwise agreed in writing. You agree to pay the full amount shown at checkout when your furniture is delivered.',
  },
  {
    title: '6. Delivery & Installation',
    body: 'Delivery timelines are estimates and may vary by location and product availability. Risk of loss passes to you upon delivery to the address provided. Installation services, where offered, are subject to separate scheduling and may incur additional fees disclosed before booking.',
  },
  {
    title: '7. Custom Furniture Orders',
    body: 'Custom orders may require deposits, design approval, and longer lead times. Specifications agreed in writing (including measurements and materials) form the basis of production. Changes after approval may affect price and delivery date.',
  },
  {
    title: '8. Returns & Refunds',
    body: 'Standard products may be eligible for return within the period stated on the product page or at checkout, provided items are unused and in original packaging. Custom-made, clearance, and specially ordered items are generally non-refundable unless defective or not as agreed. Contact us within 7 days of delivery for damaged or incorrect items.',
  },
  {
    title: '9. Warranty',
    body: 'Manufacturer or store warranty terms apply as described on each product. Warranty does not cover normal wear, misuse, or damage from improper assembly unless our installation service was used.',
  },
  {
    title: '10. Intellectual Property',
    body: 'All content on this site—including logos, images, text, and AI-generated recommendations—is owned by Anura Furniture or its licensors. You may not copy, scrape, or redistribute content without written permission.',
  },
  {
    title: '11. AI Features',
    body: 'Our AI chatbot, room designer, and recommendation tools provide suggestions for convenience only. They do not constitute professional interior design or structural advice. You are responsible for verifying suitability before purchase.',
  },
  {
    title: '12. Limitation of Liability',
    body: 'To the fullest extent permitted by Sri Lankan law, we are not liable for indirect, incidental, or consequential damages arising from use of our services. Our total liability for any claim related to an order is limited to the amount you paid for that order.',
  },
  {
    title: '13. Governing Law',
    body: 'These terms are governed by the laws of Sri Lanka. Disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.',
  },
  {
    title: '14. Changes',
    body: 'We may update these terms from time to time. The “Last updated” date below reflects the latest version. Continued use of the site after changes constitutes acceptance.',
  },
  {
    title: '15. Contact',
    body: 'For questions about these terms, contact us at anurafurniture238@gmail.com, +94 72 330 3946, or via our Contact page.',
  },
];

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service – Anura Furniture</title>
        <meta name="description" content="Terms of Service for Anura Furniture – Dekatana online store and showroom." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-8 h-8 text-cyan-300" />
              <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-blue-200">Last updated: {formatLongDate(POLICY_LAST_UPDATED)}</p>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 py-12">
          <div className="card p-8 md:p-10 space-y-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Please read these Terms of Service carefully before using Anura Furniture. These terms apply to all visitors, customers, and users of our website and services.
            </p>

            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.body}</p>
              </section>
            ))}

            <p className="text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
              See also our{' '}
              <Link to="/privacy" className="text-primary-700 dark:text-primary-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
