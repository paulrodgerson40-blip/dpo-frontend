export default function Home() {
  return (
    <main style={{ minHeight: "100vh", padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Delivery Ignite</h1>
      <h2>Turn delivery-platform food photos into sales-ready menu images.</h2>

      <p>
        We help restaurants improve Uber Eats, DoorDash and online ordering images with
        cleaner, sharper, more appetising food photography.
      </p>

      <a href="https://app.deliveryignite.com/app">
        <button style={{ padding: "14px 22px", borderRadius: 10, background: "#111", color: "#fff" }}>
          Open Image Library
        </button>
      </a>
    </main>
  );
}
