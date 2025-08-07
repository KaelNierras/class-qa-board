'use client'

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface AuthenticatedLayoutProps {
    children: ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="p-5">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
