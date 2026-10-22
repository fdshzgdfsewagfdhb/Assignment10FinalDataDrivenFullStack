import "@/src/app/styles.css";
import Header from "@/src/components/Header.jsx";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Friendly Tales",
  description:
    "Friendly Tales is a story review website built with Next.js and Firebase.",
};

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body>
        <Header initialUser={currentUser?.toJSON()} />

        <main>{children}</main>
      </body>
    </html>
  );
}
