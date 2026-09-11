import { notFound } from "next/navigation";

// Any URL under a locale that no page matches ends up here and renders the
// localized not-found page.
export default function CatchAll() {
  notFound();
}
