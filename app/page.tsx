export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background:
          "linear-gradient(135deg, #f5f7ff 0%, #eef2ff 45%, #ffffff 100%)",
        color: "#111827",
        padding: "48px 24px",
      }}
    >
      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          borderRadius: 32,
          padding: "56px",
          background:
            "linear-gradient(135deg, #111633 0%, #1f2360 55%, #3347a5 100%)",
          color: "white",
          boxShadow: "0 30px 80px rgba(15, 23, 42, 0.25)",
        }}
      >
        <p
          style={{
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#9ee7ff",
            fontWeight: 800,
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          Delivery Platform Optimization
        </p>

        <h1
          style={{
            fontSize: 56,
            lineHeight: 1.02,
            maxWidth: 820,
            margin: 0,
          }}
        >
          Food images that make customers stop scrolling and start ordering.
        </h1>

        <p
          style={{
            fontSize: 20,
            lineHeight: 1.6,
            maxWidth: 720,
            color: "#e5e7ff",
            marginTop: 24,
          }}
        >
          Delivery Ignite enhances restaurant menu photos for Uber Eats,
          DoorDash and online ordering platforms — cleaner, sharper, more
          appetising, and ready to sell.
        </p>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://app.deliveryignite.com/app"
            style={{
              textDecoration: "none",
              background: "white",
              color: "#111633",
              padding: "16px 24px",
              borderRadius: 999,
              fontWeight: 800,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            Launch Image Library →
          </a>

          <a
            href="mailto:hello@deliveryignite.com"
            style={{
              textDecoration: "none",
              color: "white",
              padding: "16px 24px",
              borderRadius: 999,
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            Contact us
          </a>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1120,
          margin: "28px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
        }}
      >
        {[
          ["01", "Upload", "Add your existing restaurant food photos."],
          ["02", "Enhance", "Create cleaner, premium menu-ready images."],
          ["03", "Compare", "Review original vs enhanced before using."],
          ["04", "Publish", "Use better images across delivery platforms."],
        ].map(([num, title, text]) => (
          <div
            key={title}
            style={{
              background: "white",
              borderRadius: 24,
              padding: 26,
              boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <p style={{ color: "#4f46e5", fontWeight: 900 }}>{num}</p>
            <h3 style={{ fontSize: 22, margin: "8px 0" }}>{title}</h3>
            <p style={{ color: "#64748b", lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
