import PolicyLayout, { PolicySection } from "@/components/policy/PolicyLayout";

const ShippingPage = () => {
  return (
    <PolicyLayout
      eyebrow="Shipping policy"
      title="From our door to yours"
      description="Everything you need to know about dispatch timelines, delivery updates, and what happens when a package is delayed."
      updated="September 14, 2026"
      active="Shipping"
    >
      <PolicySection number="01" title="Processing orders">
        <p>
          Orders are checked and prepared after payment confirmation. Dispatch
          timing may vary during launches, sale events, holidays, or when an
          item needs additional quality checks.
        </p>
      </PolicySection>
      <PolicySection number="02" title="Delivery updates">
        <p>
          Once your order is dispatched, tracking details are shared through the
          contact information provided at checkout. Please keep your phone
          reachable for courier updates.
        </p>
      </PolicySection>
      <PolicySection number="03" title="Delivery address">
        <p>
          Please review your address before placing the order. Changes after
          dispatch may not be possible, and re-delivery or address correction
          charges may apply when incorrect details are provided.
        </p>
      </PolicySection>
      <PolicySection number="04" title="Delays and exceptions">
        <p>
          Weather, public holidays, courier disruptions, and remote locations
          can affect delivery timelines. If tracking has not moved for an
          unusual period, contact us with your order number so we can
          investigate.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default ShippingPage;
