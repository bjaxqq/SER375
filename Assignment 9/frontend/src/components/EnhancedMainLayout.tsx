import { Outlet } from "react-router-dom"
import EnhancedNavBar from "./enhanced-navbar/EnhancedNavBar"
import EnhancedFooter from "./enhanced-footer/EnhancedFooter"

export default function EnhancedMainLayout() {
  return (
    <>
      <EnhancedNavBar />
      <Outlet />
      <EnhancedFooter />
    </>
  )
}
