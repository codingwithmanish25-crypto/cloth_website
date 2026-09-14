import PolicyLayout, { PolicySection } from "@/components/policy/PolicyLayout";

const TermsPage = () => {
  return (
    <PolicyLayout
      eyebrow="Terms and conditions"
      title="The rules that keep shopping clear"
      description="These terms describe how our website, products, orders, and services work. By using the site, you agree to follow them."
      updated="September 14, 2026"
      active="Terms"
    >
      <PolicySection number="01" title="Using our website">
        <p>
          You agree to provide accurate information, use the website lawfully,
          and keep account credentials confidential. We may restrict access when
          necessary to protect customers, the business, or the site.
        </p>
      </PolicySection>
      <PolicySection number="02" title="Products and pricing">
        <p>
          We work to keep product descriptions, images, availability, and prices
          accurate. Small colour or finish differences may occur. We may correct
          errors or cancel an order when a material listing error affects the
          purchase.
        </p>
      </PolicySection>
      <PolicySection number="03" title="Orders and payment">
        <p>
          An order is accepted when we confirm it for processing. Payment must
          be completed through the available checkout methods. We may contact
          you to verify details before dispatch.
        </p>
      </PolicySection>
      <PolicySection number="04" title="Intellectual property">
        <p>
          Website content, product photography, brand assets, and written
          materials belong to their respective owners and may not be copied,
          republished, or commercially used without permission.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default TermsPage;
