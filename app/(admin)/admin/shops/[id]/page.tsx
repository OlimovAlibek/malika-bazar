export default function EditShopPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Edit Shop: {params.id}</h1>
    </div>
  );
}
