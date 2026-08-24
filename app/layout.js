import "../styles.css";

export const metadata = {
  title: "Jian Jiang — Software & AI",
  description: "Jian Jiang's portfolio—AI agents, machine learning, data systems, and software engineering.",
  metadataBase: new URL("https://jiangjian9803-eng.github.io"),
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
