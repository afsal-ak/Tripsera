
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange">12</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">10</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
