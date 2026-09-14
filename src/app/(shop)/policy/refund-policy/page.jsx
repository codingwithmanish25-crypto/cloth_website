import PolicyLayout, { PolicySection } from "@/components/policy/PolicyLayout";

const RefundPage = () => {
  return (
    <PolicyLayout
      eyebrow="Refund policy"
      title="Returns, refunds and cancellations"
      description="We want every order to feel right. Here is a clear guide to cancellations, eligible returns, and how refunds are handled."
      updated="September 14, 2026"
      active="Refunds"
    >
      <PolicySection number="01" title="Cancellation window">
        <p>
          You may request cancellation before your order is packed for dispatch.
          Once an order has shipped, please follow the return process instead.
          Contact support as soon as possible with your order number.
        </p>
      </PolicySection>
      <PolicySection number="02" title="Refund eligibility">
        <p>
          Items must be unused, unwashed, undamaged, and returned with original
          tags and packaging. Items showing wear, altered items, and products
          returned without required accessories may not qualify.
        </p>
      </PolicySection>
      <PolicySection number="03" title="Refund timeline">
        <p>
          After the returned item passes inspection, the approved refund is
          issued to the original payment method. Banks and payment providers may
          take additional business days to reflect the amount.
        </p>
      </PolicySection>
      <PolicySection number="04" title="Damaged or incorrect items">
        <p>
          If your order arrives damaged or contains the wrong item, contact us
          within 48 hours with clear photos and your order number. We will
          review it and arrange the appropriate resolution.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default RefundPage;
