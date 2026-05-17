import CatalogPage from "../catalog/page";

type DropsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

export default function DropsPage(props: DropsPageProps) {
  return <CatalogPage {...props} />;
}
