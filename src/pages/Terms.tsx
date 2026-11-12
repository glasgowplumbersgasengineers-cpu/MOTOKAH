import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Helmet>
        <title>Terms of Service | Motokah</title>
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://www.motokah.com/terms" />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Terms &amp; Conditions</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-sm space-y-4 text-muted-foreground">
          <p>
            Welcome to Motokah. These Terms explain how buyers, sellers, dealers and visitors may use
            the Motokah website, mobile experience, listings and related services.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">1. Platform Ownership</h2>
          <p>
            Motokah is operated for the East African vehicle market. The platform technology, software,
            design systems, data structures, brand assets and related intellectual property are owned by
            1Point Solutions and licensed for Motokah operations. Motokah Africa Limited manages local
            marketplace operations, dealer relationships, listings and customer support in the agreed
            markets.
          </p>
          <p>
            This structure does not affect your ability to browse, post, contact sellers or use the
            marketplace. It simply clarifies the relationship between the technology owner and the local
            operating team.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">2. Accounts</h2>
          <p>
            You must provide accurate information when creating an account or posting a listing. You are
            responsible for keeping your login details secure and for activity that happens through your
            account.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">3. Listings</h2>
          <p>
            Listings should be accurate, current and lawful. Prices, photos, mileage, condition,
            ownership details and seller contact information should reflect the real vehicle being
            advertised. Motokah may review, edit, reject or remove listings that appear misleading,
            incomplete, duplicated, unsafe or unsuitable for the marketplace.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">4. Marketplace Transactions</h2>
          <p>
            Motokah connects buyers and sellers but is not a party to the vehicle sale unless clearly
            stated in writing. Buyers should inspect vehicles, verify documents, confirm ownership and
            avoid sending deposits before proper checks. Sellers are responsible for proving they have
            the right to sell the vehicle.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">5. Safety and Fair Use</h2>
          <p>
            Do not post stolen vehicles, fake listings, misleading prices, impersonation, spam or
            unlawful content. Do not misuse the platform, interfere with the service, or copy Motokah
            data in bulk without permission.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">6. Availability</h2>
          <p>
            We work to keep Motokah accurate and available, but the platform is provided on an
            as-available basis. Vehicle availability, pricing and seller details can change, so users
            should confirm details directly before making decisions.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">7. Updates</h2>
          <p>
            We may update these Terms as the marketplace grows. The latest version will be posted on
            this page with an updated date.
          </p>

          <h2 className="mt-8 text-xl font-bold text-foreground">8. Contact</h2>
          <p>
            For questions about these Terms or marketplace support, contact us through the{" "}
            <a href="/contact" className="text-primary hover:underline">Contact page</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
