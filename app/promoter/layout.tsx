import type { ReactNode, FC } from "react";

interface PromoterLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const PromoterLayout: FC<PromoterLayoutProps> = ({ children, modal }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default PromoterLayout;