import Link from 'next/link';
import DormCard from "@/app/components/admin/dorm_card";
import DeleteHousingForm from '@/app/components/admin/delete_housing_form';
import { housingData } from '@/lib/data/housing-data'
import HousingImageUpload from '@/app/components/housing_image_upload';

// NOTE: This page is now a server component, for fast async data fetching
// For interactivity (e.g. useState), import client components
export default async function Page() {
  const liveDormCards = await housingData.getHousingCardsData();
  return (
    <main className="min-h-screen text-white flex flex-col items-center p-6">
      {/* DORM CARDS SECTION */}
      <section className="w-full mb-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {liveDormCards.map((housing) => (
            <DormCard
              key={housing.housingId}
              {...housing}
            />
          ))}
        </div>
      </section>
      {/* UPLOAD IMAGE SECTION */}
      <section>
        <HousingImageUpload />
      </section>
      {/* HOUSING DELETION SECTION (Client Component) */}
      <section>
        <DeleteHousingForm />
      </section>
    </main>
  );
}
