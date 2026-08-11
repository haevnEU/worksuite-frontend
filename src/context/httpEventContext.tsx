// src/context/HttpEventsHandler.tsx
import React, { useEffect, useState } from "react";
import { TeapotOverlay } from "../components/overlays/teapot/TeapotOverlay.tsx";
import { UnauthorizedOverlay } from "../components/overlays/UnauthorizedOverlay/NotAuthorizedOverlay.tsx";
import { ForbiddenOverlay } from "../components/overlays/forbidden/ForbbidenOverlay.tsx";
import { httpEvents } from "../events/http.event.ts";

export const HttpEventsHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTeapotOpen, setIsTeapotOpen] = useState(false);
  const [isUnauthorizedOpen, setIsUnauthorizedOpen] = useState(false);
  const [isForbiddenOpen, setIsForbiddenOpen] = useState(false);

  useEffect(() => {
    const unsub418 = httpEvents.on("http:418-teapot", () => {
      setIsTeapotOpen(true);
    });

    const unsub401 = httpEvents.on("http:401-unauthorized", () => {
      setIsUnauthorizedOpen(true);
    });

    const unsub403 = httpEvents.on("http:403-forbidden", () => {
      setIsForbiddenOpen(true);
    });

    return () => {
      unsub418();
      unsub401();
      unsub403();
    };
  }, []);

  return (
    <>
      {children}

      <TeapotOverlay
        isOpen={isTeapotOpen}
        onClose={() => setIsTeapotOpen(false)}
      />

      <UnauthorizedOverlay
        isOpen={isUnauthorizedOpen}
        onClose={() => setIsUnauthorizedOpen(false)}
      />

      <ForbiddenOverlay
        isOpen={isForbiddenOpen}
        onClose={() => setIsForbiddenOpen(false)}
      />
    </>
  );
};
