"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "./icon";

// Context for managing sheet state
const SheetContext = React.createContext({
  open: false,
  setOpen: () => {},
});

export function Sheet({ children, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (newOpen) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
}

export function SheetTrigger({ children, asChild = false, onClick }) {
  const { setOpen } = React.useContext(SheetContext);

  const handleClick = () => {
    setOpen(true);
    if (onClick) onClick();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} className="inline-flex items-center justify-center">
      {children}
    </button>
  );
}

export function SheetContent({ children, side = "left", className = "" }) {
  const { open, setOpen } = React.useContext(SheetContext);

  const sideStyles = {
    left: "left-0 top-0 h-full w-80 max-w-[80vw] translate-x-0",
    right: "right-0 top-0 h-full w-80 max-w-[80vw] translate-x-0",
    top: "top-0 left-0 w-full h-80 max-h-[80vh] translate-y-0",
    bottom: "bottom-0 left-0 w-full h-80 max-h-[80vh] translate-y-0",
  };

  const transformStyles = {
    left: open ? "translate-x-0" : "-translate-x-full",
    right: open ? "translate-x-0" : "translate-x-full",
    top: open ? "translate-y-0" : "-translate-y-full",
    bottom: open ? "translate-y-0" : "translate-y-full",
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sheet Content */}
      <div
        className={`fixed z-50 bg-slate-800 border-slate-700 shadow-lg transition-transform duration-300 ease-in-out ${
          side === "left" || side === "right" ? "border-r" : "border-b"
        } ${sideStyles[side]} ${transformStyles[side]} ${className}`}
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-white"
        >
          <Icon name="x" size={16} />
        </button>

        {children}
      </div>
    </>
  );
}

export function SheetHeader({ children, className = "" }) {
  return <div className={`px-6 py-4 border-b border-slate-700 ${className}`}>{children}</div>;
}

export function SheetTitle({ children, className = "" }) {
  return <h2 className={`text-lg font-semibold text-white ${className}`}>{children}</h2>;
}
