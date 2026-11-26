import './globals.css';

export const metadata = {
  title: 'AUTO CARE SERVICE CENTER',
  description: 'Auto Care Service Center, No 146, Deniyaya Road, Akuressa. Reg No: 7/3594. Tel: +94 412283131, +94 704909320. Email: lakshanwasindu@gmail.com',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-800 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
