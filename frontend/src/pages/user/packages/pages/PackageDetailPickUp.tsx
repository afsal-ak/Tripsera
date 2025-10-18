interface PackageDetailPickUpProps {
  startPoint: string;
  pickupOptions?: string[]; // optional, to show all available points
}

const PackageDetailPickUp: React.FC<PackageDetailPickUpProps> = ({ startPoint, pickupOptions }) => {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border mb-6">
      <h3 className="text-lg font-semibold mb-2">Pick-up Point</h3>
      <span className="inline-block bg-orange/20 text-orange px-3 py-1 rounded-full text-sm font-semibold">
        {startPoint}
      </span>

      {pickupOptions && pickupOptions.length > 1 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Other pick-up options:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {pickupOptions.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default PackageDetailPickUp;
