import { NavLink, Stack } from "@mantine/core";
import {
  IconHeart,
  IconHome,
  IconPlaylist,
  IconSearch,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  onLinkClick?: () => void;
}

export function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  const links = [
    { icon: IconHome, label: "Home", href: "/" },
    { icon: IconSearch, label: "Discover", href: "/discover" },
    { icon: IconUpload, label: "Upload", href: "/upload/tracks" },
    { icon: IconHeart, label: "Favorites", href: "/favorites" },
    { icon: IconPlaylist, label: "Playlists", href: "/playlists" },
    { icon: IconUser, label: "Profile", href: "/profile" },
  ];

  return (
    <Stack gap={2}>
      {links.map((link) => (
        <NavLink
          key={link.href}
          component={Link}
          href={link.href}
          label={link.label}
          leftSection={<link.icon size="1.2rem" stroke={1.5} />}
          active={pathname === link.href}
          onClick={onLinkClick}
        />
      ))}
    </Stack>
  );
}
