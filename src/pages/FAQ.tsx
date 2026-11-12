import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    category: "Buying",
    items: [
      { q: "How do I find a car on Motokah?", a: "Use the search bar on the homepage or browse by category, make, or price range. You can filter results by year, mileage, fuel type, transmission, and location." },
      { q: "How do I contact a seller?", a: "Click the 'Contact Seller' button on any listing page. You can send a message directly through our in-app messaging system." },
      { q: "Are listings verified?", a: "All listings go through a review process before they appear on the site. We verify listing details and flag suspicious activity." },
      { q: "Can I save cars to view later?", a: "Yes! Click the heart icon on any listing to save it to your wishlist. You'll need to create a free account first." },
      { q: "What does 'Verified Seller' mean?", a: "Verified sellers have confirmed their identity through our verification process. Look for the verified badge on their profile." },
    ],
  },
  {
    category: "Selling",
    items: [
      { q: "How do I post a car for sale?", a: "Click 'Post Ad' in the top navigation, fill in your car's details including photos, set your price, and submit. Your listing will be reviewed and published within 24 hours." },
      { q: "Is it free to list my car?", a: "Basic listings are completely free. We also offer premium placement options to help your listing get more visibility." },
      { q: "How long will my listing stay active?", a: "Listings stay active for 60 days. You can renew them anytime from your profile page." },
      { q: "How do I edit or remove my listing?", a: "Go to your Profile > My Listings. You can edit details, mark as sold, or delete any of your listings." },
    ],
  },
  {
    category: "Account & Security",
    items: [
      { q: "How do I create an account?", a: "Click 'Sign In' and select 'Create Account'. You can sign up with email, Google, or Apple. We recommend enabling two-factor authentication for extra security." },
      { q: "I forgot my password. What do I do?", a: "Click 'Forgot password?' on the sign-in page and enter your email. We'll send you a password reset link." },
      { q: "How do I enable two-factor authentication?", a: "Go to Profile > Security tab and click 'Enable 2FA'. Scan the QR code with any authenticator app like Google Authenticator or Authy." },
      { q: "Can I delete my account?", a: "Contact our support team at info@motokah.com and we'll process your account deletion request." },
    ],
  },
  {
    category: "Payments & Pricing",
    items: [
      { q: "Does Motokah handle payments between buyers and sellers?", a: "Motokah is a marketplace that connects buyers and sellers. Payment arrangements are made directly between parties. We recommend meeting in person for transactions." },
      { q: "Are there any fees for using Motokah?", a: "Basic features are free. Premium listing options and dealer subscriptions are available for enhanced visibility." },
    ],
  },
  {
    category: "Safety",
    items: [
      { q: "How do I report a suspicious listing?", a: "Click the flag icon on any listing page and select a reason. Our team reviews all reports within 24 hours." },
      { q: "What safety tips should I follow?", a: "Always meet in public places, bring a friend, verify documents before payment, and never send money before seeing the car. Visit our Safety Tips page for more details." },
    ],
  },
];

export default function FAQ() {
  usePageTitle("FAQ & Help Center");

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">FAQ & Help Center</h1>
        <p className="text-muted-foreground text-center mb-10">Find answers to the most commonly asked questions.</p>

        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-bold text-foreground mb-3">{section.category}</h2>
              <Accordion type="multiple" className="bg-card border border-border rounded-xl overflow-hidden">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`${section.category}-${i}`} className="border-border">
                    <AccordionTrigger className="px-5 text-sm font-medium text-foreground hover:no-underline hover:bg-muted/50">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
