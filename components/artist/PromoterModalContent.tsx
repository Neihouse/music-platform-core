"use client";

import type { FC } from "react";
import { PromoterProfileContent, PromoterProfileContentProps } from "./PromoterProfileContent";
import PromoterModal from "@/components/artist/PromoterModal";

interface PromoterModalContentProps extends PromoterProfileContentProps {
}

const PromoterModalContent: FC<PromoterModalContentProps> = ({ promoter, promoterLocalities, bannerUrl, avatarUrl }) => {
  return (
    <PromoterModal>
      <PromoterProfileContent
        promoter={promoter}
        promoterLocalities={promoterLocalities}
        bannerUrl={bannerUrl}
        avatarUrl={avatarUrl}
      />
    </PromoterModal>
  );
};

export default PromoterModalContent;
