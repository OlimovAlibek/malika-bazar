import FavoritesGrid from "@/components/FavoritesGrid";


export const revalidate = 0;

export default function FavoritesPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold mb-4">
        ❤️ Sevimli telefonlar
      </h1>

      <FavoritesGrid />
    </main>
  );
}   