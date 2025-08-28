import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="flex">
            <Sidebar/>
            {children}
        </main>
      </body>
    </html>
  )
}