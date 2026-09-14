import PolicyLayout, { PolicySection } from "@/components/policy/PolicyLayout";

const ReturnPage = () => {
  return (
    <PolicyLayout
      eyebrow="Return your order"
      title="A simple return process"
      description="Need a different size or a change of mind? Follow these steps to send an eligible item back to us."
      updated="September 14, 2026"
      active="Returns"
    >
      <PolicySection number="01" title="Check the item">
        <p>
          Make sure the product is unused, unwashed, free from fragrance or
          damage, and still has its original tags and packaging. Keep your
          invoice or order confirmation handy.
        </p>
      </PolicySection>
      <PolicySection number="02" title="Contact support">
        <p>
          Send us your order number, the item you want to return, and the reason
          through our contact page. Our team will confirm eligibility and share
          the next steps.
        </p>
      </PolicySection>
      <PolicySection number="03" title="Pack it securely">
        <p>
          Use protective packaging so the item reaches us in resalable
          condition. Returns can be rejected if the product is incomplete or
          damaged during customer-arranged shipping.
        </p>
      </PolicySection>
      <PolicySection number="04" title="Inspection and resolution">
        <p>
          Once received, the item is inspected. Approved returns are exchanged
          or refunded according to your request and the applicable refund
          policy.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default ReturnPage;
