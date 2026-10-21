import Link from "next/link";
import Image from "next/image";
import { type Location, getLocationImagePath } from "@/data/locations";

/** Photo card linking to a city page, used on the homepage and the Service Areas hub. */
export default function LocationCard({ location }: { location: Location }) {
  return (
    <Link
      href={`/service-areas/${location.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-lg hover:border-[var(--color-brand-blue)]/30 transition-all"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={getLocationImagePath(location)}
          alt={`${location.name}, ${location.stateAbbr}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 448px"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-brand-blue)] transition-colors mb-2">
          {location.name}
        </h3>
        <p className="text-gray-600 text-sm">{location.shortDescription}</p>
      </div>
    </Link>
  );
}
