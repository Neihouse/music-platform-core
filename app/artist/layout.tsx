import type { ReactNode, FC } from "react";

interface ArtistLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const ArtistLayout: FC<ArtistLayoutProps> = ({ children, modal }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default ArtistLayout;
