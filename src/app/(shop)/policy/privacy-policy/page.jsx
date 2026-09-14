import PolicyLayout, { PolicySection } from "@/components/policy/PolicyLayout";

const PrivacyPage = () => {
  return (
    <PolicyLayout
      eyebrow="Privacy policy"
      title="Your privacy, handled with care"
      description="This policy explains what information we collect, why we use it, and the choices you have when you shop with us."
      updated="September 14, 2026"
      active="Privacy"
    >
      <PolicySection number="01" title="Information we collect">
        <p>
          When you place an order, create an account, contact us, or subscribe
          to updates, we may collect your name, email address, phone number,
          delivery address, and order details.
        </p>
        <p>
          We also receive limited technical information such as browser type and
          device data to keep the website secure and improve the shopping
          experience.
        </p>
      </PolicySection>
      <PolicySection number="02" title="How we use it">
        <p>
          We use your information to process and deliver orders, provide
          support, send service updates, prevent fraud, and improve our products
          and website. Marketing messages are sent only where permitted, and you
          can unsubscribe at any time.
        </p>
      </PolicySection>
      <PolicySection number="03" title="Sharing and security">
        <p>
          We share only the information needed with trusted payment, delivery,
          hosting, and customer-support partners. We do not sell your personal
          information. Reasonable technical and organisational measures are used
          to protect your data.
        </p>
      </PolicySection>
      <PolicySection number="04" title="Your choices">
        <p>
          You can ask us to access, correct, or delete personal information,
          subject to legal and operational requirements. To make a request,
          contact our support team with the email address used for your order.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
};

export default PrivacyPage;
