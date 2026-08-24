import "../styles.css";

export const metadata = {
  title: "Jian Jiang — AI Agent & ML Engineer",
  description: "Jian Jiang builds agentic AI, machine learning, embedded, and software systems with Python and C++.",
  metadataBase: new URL("https://jiangjian9803-eng.github.io"),
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
