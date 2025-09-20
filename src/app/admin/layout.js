import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    
        <main className="flex">
            <Sidebar/>
            {children}
        </main>
    
  )
}