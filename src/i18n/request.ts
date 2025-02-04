import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers"; // Import cookies API

export default getRequestConfig(async () => {
  // Wait for cookies to resolve and get the cookie store
  const cookieStore = await cookies();

  // Get locale from cookie or default to French
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "fr";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
