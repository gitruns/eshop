import Navbar from "../../components/Navbar";

function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="jumbotron text-center">
        <div className="display-4">About Us</div>
        <p className="lead">Your Trusted Online Shopping Destination</p>
      </div>
      <div className="container">
        <section>
          <p>
            Welcome to our e-commerce platform, where we strive to provide an
            exceptional online shopping experience. Founded in 2015, our mission
            has always been to connect customers with high-quality products at
            competitive prices while ensuring seamless transactions and
            outstanding customer service.
          </p>
          <p>
            Our dedicated team works tirelessly to curate a diverse selection of
            products across various categories, from electronics and fashion to
            home goods and more. We partner with trusted suppliers and
            manufacturers to bring you the latest trends and essentials,
            ensuring every purchase meets our standards for quality and value.
          </p>
          <p>
            Customer satisfaction is at the heart of everything we do. Our
            support team is available around the clock to assist with orders,
            returns, and any questions you may have. We believe in building
            lasting relationships through transparency, reliability, and
            continuous improvement of our platform.
          </p>
          <p>
            Thank you for choosing us as your online shopping destination. We're
            committed to making your experience enjoyable and convenient, every
            step of the way.
          </p>
        </section>
      </div>
    </>
  );
}

export default AboutPage;
