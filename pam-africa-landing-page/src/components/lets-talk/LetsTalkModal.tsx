"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  heroSrc: string;
  logoSrc?: string;
  title?: string;
};

export default function LetsTalkModal({
  open,
  onClose,
  heroSrc = "/images/pam_office.png",
  logoSrc = "/icons/pamlogo.svg",
  title = "Talk to PAM",
}: Props) {
  const [sent, setSent] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // --- Mouse trail motion values ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // 3 springs with different responsiveness => natural "trail"
  const x1 = useSpring(mx, { stiffness: 320, damping: 26, mass: 0.5 });
  const y1 = useSpring(my, { stiffness: 320, damping: 26, mass: 0.5 });
  const x2 = useSpring(mx, { stiffness: 220, damping: 24, mass: 0.8 });
  const y2 = useSpring(my, { stiffness: 220, damping: 24, mass: 0.8 });
  const x3 = useSpring(mx, { stiffness: 140, damping: 22, mass: 1.2 });
  const y3 = useSpring(my, { stiffness: 140, damping: 22, mass: 1.2 });

  function handleMove(e: React.MouseEvent) {
    mx.set(e.clientX);
    my.set(e.clientY + 120);
  }

  // lock scroll + esc to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      setTimeout(() => setSent(false), 200);
      setHovering(false);
    };
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData(formRef.current!);
      const data = {
        name: formData.get("name") as string,
        company: formData.get("company") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        message: formData.get("message") as string,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        // Reset form
        formRef.current?.reset();
      } else {
        setSubmitError(
          result.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-[#000000]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-x-0 bottom-0 top-0 bg-white dark:bg-[#000000] md:inset-x-4 md:inset-y-4 md:rounded-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onMouseMove={handleMove}
          >
            {/* MOUSE TRAIL (desktop only) */}
            <AnimatePresence>
              {hovering && (
                <>
                  {/* Lead box */}
                  <motion.div
                    className="pointer-events-none fixed z-[122] hidden md:flex -translate-x-1/2 -translate-y-1/2"
                    style={{ x: x1, y: y1 }}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                  >
                    <div className="rounded-full hidden dark:bg-white dark:text-[#000000] md:flex items-center justify-center bg-[#000000] w-[150px] h-[150px] text-white  text-2xl font-semibold tracking-tight shadow-2xl">
                      Let’s talk
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <div className="grid h-full grid-cols-1 md:grid-cols-2">
              {/* Left Image (hidden on mobile) */}
              <div className="relative hidden md:block">
                <Image
                  src={heroSrc}
                  alt="Office"
                  fill
                  className="object-cover rounded-l-lg"
                  priority
                />
              </div>

              {/* Right panel */}
              <div className="relative flex h-full w-full items-start justify-center overflow-y-auto">
                {/* close button */}
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Content */}
                <div
                  className={`w-full max-w-lg px-4 py-6 ${
                    sent ? "h-full flex items-center justify-center" : "pt-16"
                  } md:px-10 md:pt-16`}
                >
                  {!sent ? (
                    <div className="space-y-6">
                      <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
                        {title}
                      </h2>

                      <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        <label className="block">
                          <span className="block text-sm mb-2 font-medium">
                            Name
                          </span>
                          <input
                            name="name"
                            required
                            className="w-full rounded border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#000000] transition-colors duration-200"
                          />
                        </label>

                        <label className="block">
                          <span className="block text-sm mb-2 font-medium">
                            Company Name
                          </span>
                          <input
                            name="company"
                            className="w-full rounded border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#000000] transition-colors duration-200"
                          />
                        </label>

                        <label className="block">
                          <span className="block text-sm mb-2 font-medium">
                            Email
                          </span>
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full rounded border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#000000] transition-colors duration-200"
                          />
                        </label>

                        <label className="block">
                          <span className="block text-sm mb-2 font-medium">
                            Phone
                          </span>
                          <input
                            name="phone"
                            className="w-full rounded border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#000000] transition-colors duration-200"
                          />
                        </label>

                        <label className="block">
                          <span className="block text-sm mb-2 font-medium">
                            Tell us what you need
                          </span>
                          <textarea
                            name="message"
                            required
                            rows={4}
                            className="w-full resize-none rounded border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#000000] transition-colors duration-200"
                          />
                        </label>

                        {submitError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {submitError}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded bg-[#000000] dark:bg-white dark:text-[#000000] px-4 py-3 text-sm font-medium text-white hover:bg-neutral-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Sending..." : "Submit"}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col items-center justify-center gap-6 pb-12 min-h-[300px]">
                      {logoSrc && (
                        <div className="relative h-24 w-24 md:h-32 md:w-32 mx-auto">
                          <Image
                            src={logoSrc}
                            alt="PAM"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="text-center space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                          Thank You!
                        </h3>
                        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                          Your message was sent, we will be in touch soon
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
