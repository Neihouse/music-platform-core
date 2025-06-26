"use client";

import { Modal } from "@mantine/core";
import type { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PromoterModalProps {
  children: ReactNode;
}

const PromoterModal: FC<PromoterModalProps> = ({ children }) => {
  const router = useRouter();
  const [opened, setOpened] = useState(true);

  const handleClose = () => {
    setOpened(false);
    router.back();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="90%"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        content: {
          maxHeight: '90vh',
          overflow: 'auto',
        },
        body: {
          padding: 0,
        },
      }}
      withCloseButton={true}
    >
      {children}
    </Modal>
  );
};

export default PromoterModal;
