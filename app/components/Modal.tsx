import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { HTMLProps } from "react";

interface ModalProps extends HTMLProps<"div"> {
  isOpen: boolean | false;
  head: React.ReactNode;
  body: React.ReactNode;
}

export default function Modal({ ...props }: ModalProps) {
  return (
    <AnimatePresence>
      { props.isOpen &&
      <Dialog
        static
        as={ motion.div }
        open={ props.isOpen }
        onClose={ () => {} }
        className={ "fixed w-full h-[100vh] z-[1000] bg-white" }
        initial={{ bottom: -1000 }}
        animate={{ bottom: 0 }}
        exit={{ bottom: -1000 }}
        transition={{ duration: 0.25, ease: "easeIn" }}
      >
        { props.head &&
        <Dialog.Title className={ "modal-head" } as={ "div" }>
          { props.head }
        </Dialog.Title>
        }
        <Dialog.Panel>
          { props.body }
        </Dialog.Panel>
      </Dialog>
      }
    </AnimatePresence>
  );
}