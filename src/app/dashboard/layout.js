import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
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