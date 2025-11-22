function Header() {
  return (
    <div
      className="jumbotron text-center"
      style={{
        backgroundColor: "white",
        padding: "var(--spacing-xxl)",
        borderRadius: "var(--border-radius-lg)",
        boxShadow: "var(--shadow-lg)",
        marginBottom: "var(--spacing-lg)",
      }}
    >
      <h1
        className="display-4"
        style={{
          fontSize: "var(--font-size-xxxxl)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        Hello, world!
      </h1>
      <p
        className="lead"
        style={{
          fontSize: "var(--font-size-lg)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        This is a simple hero unit, a simple jumbotron-style component for
        calling extra attention to featured content or information.
      </p>
      <hr
        className="my-4"
        style={{
          borderColor: "var(--color-grey-300)",
          marginTop: "var(--spacing-xl)",
          marginBottom: "var(--spacing-lg)",
        }}
      />
      <p
        style={{
          marginBottom: "var(--spacing-lg)",
          fontSize: "var(--font-size-md)",
        }}
      >
        Welcome User. Your one stop shop for all your needs!
      </p>
      <a
        className="btn btn-primary btn-lg"
        href="/products"
        role="button"
        style={{
          padding: "var(--spacing-md) var(--spacing-lg)",
          fontSize: "var(--font-size-lg)",
          borderRadius: "var(--border-radius-md)",
        }}
      >
        Start Shopping
      </a>
    </div>
  );
}

export default Header;
