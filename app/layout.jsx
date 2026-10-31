import "./globals.css";

export const metadata = {
  title: "REVORA IDE — Engineering Workspace",
  description: "REVORA IDE foundation preview. Local drafts only; backend capabilities remain disabled.",
  applicationName: "REVORA IDE"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101318"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
