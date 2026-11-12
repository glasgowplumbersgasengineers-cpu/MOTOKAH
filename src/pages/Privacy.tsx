import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Helmet>
        <title>Privacy Policy | Motokah</title>
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://www.motokah.com/privacy" />
      </Helmet>
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p>
            Motokah respects your privacy. This Privacy Policy explains how we collect, use, share and
            protect your personal information when you use the Motokah website, mobile applications,
            listings and related services (the "Platform").
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Platform &amp; Data Controller</h2>
          <p>
            Motokah is currently powered by{" "}
            <a
              href="https://1pointsolutions.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              1Point Solutions
            </a>{" "}
            (UK), licensed to <strong className="text-foreground">Motokah Africa Limited</strong>.
            Motokah Africa Limited acts as the data controller for all personal information
            processed through this Platform.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Information We Collect</h2>
          <p>
            We collect information you provide directly — such as your name, email, phone number,
            location, profile details and listing content — when you create an account, post a listing,
            save a vehicle, or contact another user. We also collect technical information automatically,
            including device type, browser, IP address and pages viewed, to operate and improve the
            Platform.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">How We Use Your Information</h2>
          <p>
            We use your information to provide and operate the Platform, display and manage your
            listings, connect buyers and sellers, personalise your experience, prevent fraud and abuse,
            and send you service-related and (where permitted) marketing communications.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Sharing of Information</h2>
          <p>
            Listing details you publish are visible to other users of the Platform. We may share data
            with service providers who help us run the Platform (for example hosting and authentication
            providers), and where required by law. We do not sell your personal information.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Data Protection</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal data
            against unauthorised access, loss or misuse. No method of transmission or storage is fully
            secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Your Rights</h2>
          <p>
            Subject to applicable law, you may request access to, correction of, or deletion of your
            personal information, and you may opt out of marketing communications at any time. To make a
            request, contact us via the Contact page.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected by an
            updated "Last updated" date above.
          </p>

          <h2 className="text-xl font-bold text-foreground mt-6">Contact</h2>
          <p>
            For privacy questions or requests, contact Motokah Africa Limited via the{" "}
            <a href="/contact" className="text-primary hover:underline">Contact page</a>. For matters
            relating to platform ownership or data held by 1Point Solutions, contact{" "}
            <a
              href="https://1pointsolutions.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              1pointsolutions.cloud
            </a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
