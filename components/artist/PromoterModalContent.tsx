"use client";

import type { FC } from "react";
import { PromoterProfileContent } from "./PromoterProfileContent";
import PromoterModal from "@/components/artist/PromoterModal";

interface PromoterModalContentProps {
  promoter: any;
}

const PromoterModalContent: FC<PromoterModalContentProps> = ({ promoter }) => {
  return (
    <PromoterModal>
      <PromoterProfileContent promoter={promoter} />
    </PromoterModal>
  );
};

export default PromoterModalContent;
