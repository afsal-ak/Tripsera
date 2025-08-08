import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Cropper from 'react-easy-crop';
import { toast } from 'sonner';
import { getCroppedImg } from '@/lib/utils/cropUtils';
import {
  getCategory,
  getPackageById,
  updatePackage,
} from '@/services/admin/packageService';
import Modal from '@/components/ui/Model';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/Button';
import { Label } from '@/component/ui/label';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const EditPackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [durationDays, setDurationDays] = useState<string>('');
  const [durationNights, setDurationNights] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [included, setIncluded] = useState<string[]>(['']);
  const [notIncluded, setNotIncluded] = useState<string[]>(['']);
  const [location, setLocation] = useState([{ name: '', lat: 0, lng: 0 }]);
  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', description: '', activities: [''] },
  ]);
  const [category, setCategory] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ _id: string; name: string }[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<{ public_id: string; url: string }[]>(
    []
  );
  console.log(existingImageUrls, 'exst');
  const [showCropper, setShowCropper] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          return;
        }
        const data = await getPackageById(id);
        console.log(data, 'pkd data')
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        //  setDuration(data.duration.toString());

        //  setDuration(data.duration.toString());
        setStartDate(data.startDate?.split('T')[0] || '');
        setEndDate(data.endDate?.split('T')[0] || '');
        setCategory(data.category);
        setLocation(
          data.location.map((loc: any) => ({
            name: loc.name,
            lat: loc.geo.coordinates[1],
            lng: loc.geo.coordinates[0],
          }))
        );
        setIncluded(data.included);
        setNotIncluded(data.notIncluded);
        setItinerary(data.itinerary);
        setExistingImageUrls(
          data.imageUrls
            .filter((img: any) => img?.public_id && img?.url)
            .map((img: any) => ({ public_id: img.public_id, url: img.url }))
        );
        setDurationDays((data.durationDays ?? 1).toString());
        setDurationNights((data.durationNights ?? 1).toString());

      } catch {
        toast.error('Failed to fetch package details');
      }
    };
    fetchData();
  }, [id]);
  console.log(price, 'daat');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategory();
        setCategoryOptions(categories);
      } catch {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length + existingImageUrls.length >= 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }
    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image exceeds ${MAX_SIZE_MB}MB size limit`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageToCrop(file);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!imagePreview || !croppedAreaPixels || !imageToCrop) return;
    const result = await getCroppedImg(imagePreview, croppedAreaPixels);
    if (result?.file) {
      setImages((prev) => [...prev, result.file]);
      setShowCropper(false);
      setImageToCrop(null);
    }
  };

  const removeNewImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const removeExistingImage = (index: number) => {
    const updated = [...existingImageUrls];
    updated.splice(index, 1);
    setExistingImageUrls(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const priceValue = Number(price);
    const durationValue = Number(duration);

    if (!trimmedTitle) return toast.error('Title is required');
    if (!trimmedDescription) return toast.error('Description is required');
    if (!price || isNaN(priceValue) || priceValue <= 0)
      return toast.error('Price must be a positive number');
    // if (!duration || isNaN(durationValue) || durationValue <= 0)
    //   return toast.error('Duration must be a positive number');
    const parsedDays = parseInt(durationDays);
    const parsedNights = parseInt(durationNights);

    const dayNightDiff = Math.abs(parsedDays - parsedNights);
    if (dayNightDiff > 1) {
      toast.error('The difference between days and nights cannot be more than 1');
      return;
    }
    if (!startDate || !endDate) return toast.error('Start and end dates are required');
    if (category.length === 0) return toast.error('Select at least one category');
    if (location.length === 0) {
      return toast.error('Add at least one location');
    }
    for (let i = 0; i < location.length; i++) {
      const { name, lat, lng } = location[i];

      if (!name.trim()) {
        return toast.error(`location name cant be empty`);
      }

      if (!lat || lat < 0) {
        return toast.error(`location latitute cant be empty and must be positive`);
      }
      if (!lng || lng < 0) {
        return toast.error(`location longitude cant be empty must be positive`);
      }

      // if (activities.some(a => !a.trim())) {
      //   return toast.error(`Itinerary Day ${i + 1}: Activities cannot have empty values`);
      // }
    }

    if (images.length + existingImageUrls.length === 0) {
      return toast.error('Upload at least one image');
    }

    //  Included validation
    const cleanedIncluded = included.map((i) => i.trim()).filter(Boolean);
    if (cleanedIncluded.length === 0) return toast.error("Add at least one 'Included' item");
    if (included.some((i) => !i.trim())) return toast.error('Included items cannot be empty');

    //  Not Included validation
    const cleanedNotIncluded = notIncluded.map((i) => i.trim()).filter(Boolean);
    if (cleanedNotIncluded.length === 0) return toast.error("Add at least one 'Not Included' item");
    if (notIncluded.some((i) => !i.trim()))
      return toast.error('Not Included items cannot be empty');

    //  Itinerary validation
    if (itinerary.length === 0) return toast.error('Add at least one itinerary day');

    for (let i = 0; i < itinerary.length; i++) {
      const { day, title, activities } = itinerary[i];

      if (!day || isNaN(Number(day))) {
        return toast.error(`Itinerary Day ${i + 1}: Invalid or missing day`);
      }
      if (!title.trim()) return toast.error(`Itinerary Day ${i + 1}: Title is required`);

      if (activities.some((a) => !a.trim())) {
        return toast.error(`Itinerary Day ${i + 1}: Activities cannot have empty values`);
      }
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('title', trimmedTitle);
    formData.append('description', trimmedDescription);
    formData.append('price', price);
    //formData.append('duration', duration);
    formData.append('durationDays', durationDays);
    formData.append('durationNights', durationNights);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('category', JSON.stringify(category));
    formData.append(
      'location',
      JSON.stringify(
        location.map((loc) => ({
          name: loc.name,
          geo: {
            type: 'Point',
            coordinates: [loc.lng, loc.lat],
          },
        }))
      )
    );
    formData.append('included', JSON.stringify(included));
    formData.append('notIncluded', JSON.stringify(notIncluded));
    formData.append('itinerary', JSON.stringify(itinerary));
    formData.append('existingImageUrls', JSON.stringify(existingImageUrls));
    images.forEach((file) => formData.append('images', file));

    setLoading(true);

    try {
      if (!id) {
        return;
      }
      await updatePackage(id, formData);
      toast.success('Package updated successfully');
      navigate('/admin/packages');
    } catch (err) {
      toast.error('Failed to update package');
    } finally {
      setLoading(true);
    }
  };

  const addLocation = () => {
    setLocation([...location, { name: '', lat: 0, lng: 0 }]);
  };
  const removeLocation = (index: number) => {
    if (location.length > 1) {
      setLocation(location.filter((_, i) => i !== index));
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label>Price</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        {/* <div>
          <Label>Duration</Label>
          <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div> */}
        <div>
          <Label>Day Duration</Label>
          <Input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
        </div>
        <div>
          <Label>Night Duration</Label>
          <Input type="number" min={1} value={durationNights} onChange={(e) => setDurationNights(e.target.value)} />
        </div>
        <br />
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate ? startDate : new Date().toISOString().split('T')[0]}
            className="w-full border border-border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <Label>Categories</Label>
        <Select
          isMulti
          options={categoryOptions.map((c) => ({ value: c._id, label: c.name }))}
          value={categoryOptions
            .filter((c) => category.includes(c._id))
            .map((c) => ({ value: c._id, label: c.name }))}
          onChange={(selected) => setCategory(selected.map((s) => s.value))}
        />
      </div>
      {/* Included Items */}
      <Label className="block mb-2 font-semibold">Included</Label>
      {included.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...included];
              updated[index] = e.target.value;
              setIncluded(updated);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const updated = included.filter((_, i) => i !== index);
              setIncluded(updated);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setIncluded([...included, ''])}
        className="bg-orange text-white px-4 py-1 rounded mb-6"
      >
        + Add Included
      </button>

      {/* Not Included Items */}
      <Label className="block mb-2 font-semibold">Not Included</Label>
      {notIncluded.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...notIncluded];
              updated[index] = e.target.value;
              setNotIncluded(updated);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const updated = notIncluded.filter((_, i) => i !== index);
              setNotIncluded(updated);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setNotIncluded([...notIncluded, ''])}
        className="bg-orange text-white px-4 py-1 rounded mb-6"
      >
        + Add Not Included
      </button>

      {/* Itinerary */}
      <Label className="block mb-2 font-semibold">Itinerary</Label>
      {itinerary.map((item, index) => (
        <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
          <div className="mb-2">
            <Label>Day</Label>
            <Input
              type="number"
              value={item.day}
              onChange={(e) => {
                const updated = [...itinerary];
                updated[index].day = Number(e.target.value);
                setItinerary(updated);
              }}
            />
          </div>

          <div className="mb-2">
            <Label>Title</Label>
            <Input
              type="text"
              value={item.title}
              onChange={(e) => {
                const updated = [...itinerary];
                updated[index].title = e.target.value;
                setItinerary(updated);
              }}
            />
          </div>

          {/* <div className="mb-2">
      <Label>Description</Label>
      <Textarea
        className="w-full border rounded p-2"
        value={item.description}
        onChange={(e) => {
          const updated = [...itinerary];
          updated[index].description = e.target.value;
          setItinerary(updated);
        }}
      />
    </div> */}

          <div className="mb-2">
            <Label>Activities</Label>
            {item.activities.map((activity, actIndex) => (
              <div key={actIndex} className="flex gap-2 mb-1">
                <Input
                  type="text"
                  value={activity}
                  onChange={(e) => {
                    const updated = [...itinerary];
                    updated[index].activities[actIndex] = e.target.value;
                    setItinerary(updated);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...itinerary];
                    updated[index].activities.splice(actIndex, 1);
                    setItinerary(updated);
                  }}
                  className="bg-red-600 text-white px-2 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const updated = [...itinerary];
                updated[index].activities.push('');
                setItinerary(updated);
              }}
              className="bg-orange text-white px-3 py-1 rounded mt-2"
            >
              + Add Activity
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              const updated = itinerary.filter((_, i) => i !== index);
              setItinerary(updated);
            }}
            className="mt-4 bg-red-700 text-white px-4 py-1 rounded"
          >
            ✕ Remove Itinerary Day
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setItinerary([
            ...itinerary,
            { day: itinerary.length + 1, title: '', description: '', activities: [''] },
          ])
        }
        className="bg-orange text-white px-5 py-2 rounded mb-8"
      >
        + Add Itinerary Day
      </button>

      {location.map((loc, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-2 items-center border border-border p-4 rounded-md"
        >
          <input
            type="text"
            placeholder="Location name"
            value={loc.name}
            onChange={(e) => {
              const updated = [...location];
              updated[index].name = e.target.value;
              //updated[index].lng = e.target.value;
              //updated[index].day = Number(e.target.value);
              setLocation(updated);
            }}
            className="col-span-4 px-3 py-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={loc.lat}
            // onChange={(e) => handleChange(index, "latitude", e.target.value)}
            // min={0}
            onChange={(e) => {
              const updated = [...location];
              updated[index].lat = Number(e.target.value);
              //updated[index].lng = e.target.value;
              //updated[index].day = Number(e.target.value);
              setLocation(updated);
            }}
            className="col-span-3 px-3 py-2 border rounded text-sm"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={loc.lng}
            //  onChange={(e) => handleChange(index, "longitude", e.target.value)}

            onChange={(e) => {
              const updated = [...location];
              updated[index].lng = Number(e.target.value);
              //updated[index].lng = e.target.value;
              //updated[index].day = Number(e.target.value);
              setLocation(updated);
            }}
            className="col-span-3 px-3 py-2 border rounded text-sm"
          />
          {location.length > 0 && (
            <button
              type="button"
              onClick={() => removeLocation(index)}
              className="col-span-2 text-red-500 hover:underline text-sm"
            >
              ✖ Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addLocation}
        className="bg-orange text-white px-5 py-2 rounded mb-8"
      >
        Add More Location
      </button>
      <div></div>
      <div>
        <Label>Images</Label>
        <div className="flex flex-wrap gap-4 mb-2">
          {existingImageUrls.map((img, index) => (
            <div key={index} className="relative w-32 h-32">
              <img src={img.url} className="object-cover w-full h-full rounded" />

              <div className="absolute top-0 right-0 m-1">
                <ConfirmDialog
                  title="Delete this image?"
                  actionLabel="Delete"
                  onConfirm={() => removeExistingImage(index)}
                >
                  <Button size="icon" variant="destructive" className="p-1 text-xs">
                    ✕
                  </Button>
                </ConfirmDialog>
              </div>
            </div>
          ))}

          {images.map((file, index) => (
            <div key={`new-${index}`} className="relative w-32 h-32">
              <img src={URL.createObjectURL(file)} className="object-cover w-full h-full rounded" />

              <div className="absolute top-0 right-0 m-1">
                <ConfirmDialog
                  title="Delete this image?"
                  actionLabel="Delete"
                  onConfirm={() => removeNewImage(index)}
                >
                  <Button size="icon" variant="destructive" className="p-1 text-xs">
                    ✕
                  </Button>
                </ConfirmDialog>
              </div>
            </div>
          ))}
        </div>
        {/* {(images.length + existingImageUrls.length) < 4 && (
  <Input type="file" accept="image/*" onChange={handleImageChange} />
)} */}
        <div>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <label
            htmlFor="fileUpload"
            className="inline-block cursor-pointer bg-orange text-white px-4 py-2 rounded shadow hover:bg-orange-dark transition text-sm"
          >
            Upload Image
          </label>
        </div>
      </div>

      {showCropper && (
        <Modal onClose={() => setShowCropper(false)} title="Crop Image">
          <div className="relative w-full h-96 bg-black">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={handleCropConfirm}>
              Crop & Save
            </Button>
          </div>
        </Modal>
      )}

      {/* <Button className='bg-orange' type="submit">Update Package</Button> */}
      <button
        type="submit"
        className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition mb-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? 'updating...' : 'Update'}
      </button>
    </form>
  );
};

export default EditPackageForm;
