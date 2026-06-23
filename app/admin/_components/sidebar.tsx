import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { HomeIcon, Package2Icon, WallpaperIcon } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    name: "Dashboard",
    url: "/admin",
    icon: HomeIcon
  },
  {
    name: "Rooms",
    url: "/admin/rooms",
    icon: WallpaperIcon
  },
  {
    name: "Products",
    url: "/admin/products",
    icon: Package2Icon
  }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">BrwnKit</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
                <a href={project.url}>
                  <project.icon />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
