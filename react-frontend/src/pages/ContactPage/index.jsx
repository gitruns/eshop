import Navbar from "../../components/Navbar";

function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="jumbotron text-center">
        <div className="display-4">Contact Us</div>
        <p className="lead">We're Here to Help</p>
      </div>
      <div className="container">
        <section>
          <h2>Get In Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions about your
            order, need assistance with returns, or want to provide feedback on
            your shopping experience, our team is here to help.
          </p>
          <div className="row">
            <div className="col-md-6">
              <h3>Customer Service</h3>
              <p>Phone: (555) 123-4567</p>
              <p>Email: support@eshop.com</p>
              <p>Hours: Monday - Friday, 9 AM - 6 PM EST</p>
            </div>
            <div className="col-md-6">
              <h3>Business Address</h3>
              <p>123 Commerce Street</p>
              <p>E-commerce City, EC 12345</p>
              <p>United States</p>
            </div>
          </div>
          <p>
            For technical support or website-related issues, please visit our
            help center or contact us through the live chat feature on our
            website. We strive to respond to all inquiries within 24 hours.
          </p>
        </section>
      </div>
    </>
  );
}

export default ContactPage;
