// app/privacy-policy/page.jsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy - Privmat",
  description: "Privmat Privacy Policy - How we handle your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 mt-16">
      <Card className="max-w-4xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Effective Date: 25/04/2025 | Last Updated: 02/05/2025
          </p>
        </CardHeader>
        <CardContent className="text-gray-400 prose prose-gray dark:prose-invert max-w-none">
          <p>
            Welcome to Privmat! We are committed to protecting your privacy and
            providing transparency about how we handle your personal information when you use our website
            and services (collectively, the "Service").
          </p>
          <br />
          <p>
            Please read this Privacy Policy carefully. By accessing or using our Service, you agree to
            the collection, use, and disclosure of your information as described in this Privacy Policy.
            If you do not agree, please do not use the Service.
          </p>
          <br />
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you use our Services.</p>
          <p>We collect information in the following ways:</p>
          <br />
          <ul>
            <li>
              <strong>Account Information:</strong> When you register for an account, we collect information
              necessary for account creation and management, primarily through our authentication provider,
              Clerk. This typically includes your email address, name, and hashed password (managed by Clerk).
              We store your Clerk User ID, email, and name in our database to associate your Privmat data with your account.
            </li>
            <br />
            <li>
              <strong>Tracked App Data:</strong> Information you manually enter about the applications you track,
              such as the app name, URL (optional), the email or phone number you used with that app (optional),
              whether you granted location access (boolean), and any personal notes you add.
            </li>
            <br />
            <li>
              <strong>Fake Data Presets:</strong> Any presets you save within the Fake Data Generator feature.
            </li>
            <br />
            <li>
              <strong>Data Vault Credentials:</strong> Information you choose to store in the Data Vault, such as
              website names, usernames, encrypted passwords, and notes. <strong>Note:</strong> The passwords and
              potentially other sensitive data you store in the vault are encrypted on our servers (see Security section).
            </li>
            <br />
            <li>
              <strong>Communication:</strong> If you contact us directly (e.g., for support), we may collect your
              name, email address, and the content of your communication.
            </li>
          </ul>
          <br />

          <h3>Information Collected Automatically:</h3>
          <br />
          <ul>
            <li>
              <strong>Usage Data:</strong> We may collect standard web log information about how you interact with
              the Service, such as your IP address, browser type, operating system, pages visited, time spent on
              pages, and referring URLs. This is typically used for analytics and service improvement.
            </li>
            <br />
            <li>
              <strong>Cookies and Similar Technologies:</strong> We may use cookies and similar tracking technologies
              to enhance your experience, remember your preferences, and analyze service usage. You can control
              cookie preferences through your browser settings.
            </li>
          </ul>
          <br />

          <h3>Information from Third Parties:</h3>
          <br />
          <ul>
            <li>
              <strong>Authentication Provider (Clerk):</strong> As mentioned, we receive necessary identifiers
              (like User ID, email, name) from Clerk upon successful authentication to manage your account link.
            </li>
            <br />
            <li>
              <strong>Breach Data Provider (XposedOrNot):</strong> When you use the breach check feature for your
              registered email, we query the XposedOrNot API. We store the names of breaches associated with your
              user ID and email in our database to provide your breach history. We do not store the raw results for
              checks on arbitrary emails performed via the public checking tool (if implemented).
            </li>
          </ul>
          <br />

          <h2>2. How We Use Your Information</h2>
          <br />
          <ul>
            <li><strong>To Provide and Maintain the Service:</strong> To operate the dashboard, allow you to track apps, generate fake data, store vault items, check for breaches, authenticate you, and provide core functionality.</li>
            <br />
            <li><strong>To Improve the Service:</strong> To analyze usage patterns, troubleshoot issues, gather feedback, and enhance features and usability.</li>
            <br />
            <li><strong>To Communicate with You:</strong> To respond to your inquiries, send important service-related notifications (e.g., security alerts, policy updates), and provide customer support.</li>
            <br />
            <li><strong>For Security Purposes:</strong> To detect and prevent fraud, abuse, security incidents, and other harmful activities; to enforce our Terms of Service.</li>
            <br />
            <li><strong>To Comply with Legal Obligations:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests.</li>
          </ul>
          <br />

          <h2>3. How We Share Your Information</h2>
          <br />
          <p>We are committed to your privacy and <strong>do not sell your personal information</strong>. We may share your information only in the following limited circumstances:</p>
          <br />
          <ul>
            <li><strong>Service Providers:</strong> We may share information with third-party vendors and service providers who perform services on our behalf, such as:
            <br />
              <ul>
                <li>Authentication: Clerk</li>
                <li>Database Hosting: Neon DB</li>
                <li>Analytics Providers: Google Analytics</li>
              </ul>
              These providers only have access to the information necessary to perform their functions and are obligated to protect your information.
            </li>
            <br />
            <li><strong>Data Breach Checks:</strong> We send your email address to the XposedOrNot API to perform breach checks. Their use of data is subject to their own privacy policy.</li>
            <br />
            <li><strong>Legal Requirements:</strong> We may disclose your information as required to comply with the law, protect our rights or property, prevent fraud, or protect the personal safety of users or the public.</li>
            <br />
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred. You will be notified of any such changes.</li>
          </ul>
          <br />

          <h2>4. Data Security</h2>
          <br />
          <p>We implement reasonable administrative, technical, and physical security measures to protect your information from unauthorized access, use, alteration, or destruction.</p>
          <br />
          <ul>
            <li><strong>Authentication Security:</strong> Handled by Clerk using industry-standard practices.</li>
            <br />
            <li><strong>Data Vault Encryption:</strong> Vault passwords/sensitive content are encrypted on our servers using AES-256-CBC encryption. Keys and IVs are managed server-side.</li>
            <br />
            <li><strong>HTTPS:</strong> All data transmitted between your browser and our servers is encrypted.</li>
            <br />
            <li><strong>Access Controls:</strong> Internal access to user data is restricted.</li>
            <br />
          </ul>
          <p>However, no security system is completely secure. You are responsible for safeguarding your credentials.</p>
          <br />

          <h2>5. Data Retention</h2>
          <br />
          <ul>
            <li><strong>Account Data:</strong> Retained as long as your account exists.</li><br />
            <li><strong>Tracked App Data / Vault Items / Presets:</strong> Retained until deleted by you or your account is deleted.</li><br />
            <li><strong>User Breach Links:</strong> Retained until you delete your account.</li><br />
            <li><strong>Usage Logs:</strong> May be retained for a limited period for analysis and security purposes.</li><br />
          </ul>
          <p>You may be able to delete your account and associated data through your account settings.</p><br />

          <h2>6. Your Privacy Rights</h2><br />
          <p>Depending on your jurisdiction, you may have the right to:</p><br />
          <ul>
            <li><strong>Access:</strong> Request to view the personal data we hold about you.</li><br />
            <li><strong>Correction:</strong> Request corrections to any inaccurate data.</li><br />
            <li><strong>Deletion:</strong> Request we delete your data, with certain exceptions.</li><br />
            <li><strong>Object/Restrict:</strong> Request we limit or stop processing your data.</li><br />
          </ul>
          <p>To exercise any of these rights, please contact us via the information below.</p><br />

          <h2>7. Children's Privacy</h2><br />
          <p>
            Our Service is not intended for individuals under the age of 13 (or 16 depending on jurisdiction).
            We do not knowingly collect personal information from children without parental consent.
          </p>
          <br />

          <h2>8. Third-Party Links</h2><br />
          <p>
            Our Service may contain links to third-party websites or services. We are not responsible for their
            privacy practices and encourage you to read their privacy policies.
          </p>
          <br />

          <h2>9. Changes to This Privacy Policy</h2>
          <br />
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you
            via email or a notice on the Service before the changes take effect.
          </p>
          <br />

          <h2>10. Contact Us</h2>
          <br />
          <p>
            If you have any questions about this Privacy Policy or our practices, contact us at:
          </p>
          <br />
          <p>
            info.privmat@gmail.com<br />
            Privmat<br />
          </p>
          <br />
        </CardContent>
      </Card>
    </div>
  );
}
