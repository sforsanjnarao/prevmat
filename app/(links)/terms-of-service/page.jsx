// app/terms-of-service/page.jsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Metadata for SEO
export const metadata = {
  title: "Terms of Service - Privmat",
  description: "Privmat Terms of Service - Rules for using our service.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">
      <Card className="max-w-4xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Effective Date: 25/04/2025 | Last Updated: 25/04/2025
          </p>
        </CardHeader>
        <CardContent className="text-gray-400 prose prose-gray dark:prose-invert max-w-none">
          <p>
            Welcome to Privmat! These Terms of Service ("Terms") govern your access to and use of the Privmat website,
            applications, and services (collectively, the "Service") provided by Privmat ("we," "us," or "our"). By using the Service, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use the Service. 
          </p>

          <br /><br />

          <p><strong>Please read these Terms carefully.</strong> By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.</p>

          <br /><br />

          <h2>1. Acceptance of Terms</h2>
          <p>By creating an account or using the Service in any way, you affirm that you are legally capable of entering into this agreement and that you agree to comply with these Terms.</p>

          <br /><br />

          <h2>2. Description of Service</h2>
          <p>
            Privmat provides a personal privacy dashboard designed to help users track data shared with third-party applications, generate disposable data, monitor email addresses for known data breaches, and securely store sensitive information in an encrypted vault. The features and functionalities of the Service may change over time at our discretion.
          </p>

          <br /><br />

          <h2>3. User Accounts</h2>
          <ul>
            <li><strong>Registration:</strong> You must register for an account to access most features of the Service. Account registration and authentication are handled through our third-party provider, Clerk. You agree to provide accurate and complete information during registration and to keep your account information updated.</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account login credentials (managed via Clerk) and for any activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</li>
            <li><strong>Vault Password (If Applicable):</strong> If using the Data Vault feature with a separate password, you are solely responsible for remembering this password. Due to the encryption method [Specify Server-Side], we cannot recover your vault password or decrypt your vault data if you lose the password required for decryption on our servers. [Adjust this clause significantly based on your final vault implementation - if client-side, state you CANNOT recover data].</li>
          </ul>

          <br /><br />

          <h2>4. User Conduct</h2>
          <p>You agree not to use the Service for any unlawful purpose or in any way that violates these Terms. Prohibited activities include, but are not limited to:</p>

          <br /><br />
          <ul>
            <li>Violating any applicable local, state, national, or international law or regulation.</li>
            <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
            <li>Uploading invalid data, viruses, worms, or other software agents through the Service.</li>
            <li>Collecting or harvesting any personally identifiable information, including account names, from the Service without permission.</li>
            <li>Impersonating another person or otherwise misrepresenting your affiliation with a person or entity.</li>
            <li>Accessing any content on the Service through any technology or means other than those provided or authorized by the Service.</li>
            <li>Using any automated system, including "robots," "spiders," "offline readers," etc., to access the Service in a manner that sends more request messages to the Privmat servers than a human can reasonably produce in the same period.</li>
            <li>Attempting to reverse engineer, decompile, or otherwise discover the source code of the Service, except as permitted by applicable law.</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          <ul>
            <li><strong>Our Service:</strong> The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Privmat and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without our prior written consent.</li>
            <li><strong>User Content:</strong> You retain ownership of the data you enter into the Service (e.g., tracked app details, vault content). However, by using the Service, you grant us a limited license to host, store, process, and display your content solely for the purpose of providing and improving the Service to you.</li>
          </ul>

          <h2>6. Fake Data Generator and Breach Checks</h2>
          <ul>
            <li><strong>Fake Data:</strong> The Fake Data Generator is provided for convenience. We do not guarantee that generated fake data (including temporary emails, if applicable) will be accepted by all third-party services or fulfill their verification requirements. You use generated fake data at your own risk and are responsible for complying with the terms of service of any third-party site you use it on.</li>
            <li><strong>Breach Checks:</strong> The Data Breach Monitoring feature relies on data from third-party APIs (e.g., XposedOrNot). While we strive to use reliable sources, we cannot guarantee the accuracy or completeness of the breach information provided. The absence of a reported breach does not guarantee your email has never been compromised.</li>
          </ul>

          <h2>7. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, PRIVMAT AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p><br />
          <p>
            WE DO NOT WARRANT THAT (I) THE SERVICE WILL MEET YOUR REQUIREMENTS; (II) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE; OR (IV) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.
          </p><br />

          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PRIVMAT OR ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM: (I) THE USE OR THE INABILITY TO USE THE SERVICE; (II) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES; (III) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; (IV) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SERVICE; OR (V) ANY OTHER MATTER RELATING TO THE SERVICE.
          </p><br />
          <p>
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING OR USING THE SERVICE DURING THE TWELVE (12) MONTHS PRECEDING YOUR CLAIM, OR ONE HUNDRED U.S. DOLLARS ($100), WHICHEVER IS GREATER.
          </p><br />

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Privmat and its affiliates, officers, employees, agents, partners, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that such parties may incur as a result of or arising from your (or anyone using your account's) violation of these Terms or your use of the Service.
          </p><br />

          <h2>10. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
          </p><br />
          <p>
            You may terminate your account at any time by [Describe mechanism, e.g., using the account settings page, contacting support]. Upon termination, we may delete your account and associated data in accordance with our Data Retention policy (see Privacy Policy).
          </p><br />

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your State/Country, e.g., the State of California, United States], without regard to its conflict of law provisions.
          </p><br />

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect, typically via email or a notice within the Service. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
          </p><br />

          <h2>13. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p><br />
          <p>
            info.privmat@gmail.com<br />
            PrivMat<br />
          </p><br />
        </CardContent>
      </Card>
    </div>
  );
}
