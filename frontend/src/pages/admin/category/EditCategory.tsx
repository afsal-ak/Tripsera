import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
 import { Label } from '@/components/ui/Label';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { getCategoryById, updateCategory } from '@/services/admin/categoryService';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const cat = await getCategoryById(id);
          setName(cat.name || '');
          setStatus(cat.isBlocked ? 'blocked' : 'active');
        } catch (error) {
          toast.error('Failed to fetch category');
        }
      };
      fetchData();
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.trim().toLowerCase(),
      isBlocked: status === 'blocked',
    };

    try {
      await updateCategory(id!, payload);
      toast.success('Category updated');
      navigate('/admin/categories');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update category';
      toast.error(message);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 15) {
      setError('Name cannot exceed 15 characters');
    } else {
      setError('');
      setName(value);
    }
  };
  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-gray-400 text-right">{name.length}/15</p>{' '}
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditCategory;
