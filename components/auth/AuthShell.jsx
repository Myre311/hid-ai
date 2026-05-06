import { Container } from "@/components/ui/Container";

/**
 * Shell for centered auth screens (phone, verify, login).
 * For wide screens (branch choice, profile multi-step) use the full Container directly.
 */
export function AuthShell({ children, narrow = true }) {
  return (
    <section className="flex-1 flex items-center justify-center py-12 md:py-20">
      <Container className={narrow ? "max-w-md" : "max-w-3xl"}>
        {children}
      </Container>
    </section>
  );
}
