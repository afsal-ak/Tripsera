import { PackageModel } from '@infrastructure/models/Package';
export async function generatePackageCode(): Promise<string> {
  const prefix = 'PKG';
  const year = new Date().getFullYear();

  // Get number of package made this year
  const count = await PackageModel.countDocuments({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
    },
  });

  const paddedCount = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}-${paddedCount}`;
}
