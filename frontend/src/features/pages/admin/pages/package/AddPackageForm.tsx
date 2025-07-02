
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/utils/cropUtils';
import { Input } from '@/features/components/ui/Input';
import { Textarea } from '@//components/ui/textarea';
import { Button } from '@/features/components/Button';
import { Label } from '@//components/ui/label';
import { toast } from 'sonner';
import Modal from '@//components/ui/Model';
import { addPackage, getCategory } from '@/features/services/admin/packageService';
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const AddPackageForm = () => {
  const navigate=useNavigate()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ _id: string, name: string }[]>([]);
  const [location, setLocation] = useState([{ name: '', lat: '', lng: '' }]);
  const [included, setIncluded] = useState(['']);
  const [notIncluded, setNotIncluded] = useState(['']);
  // const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);
const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '', activities: [''] }]);

  const [images, setImages] = useState<File[]>([]);
  const [showCropper, setShowCropper] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);

  const [loading,setLoading]=useState(false)

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
    if (images.length >= 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed.");
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

  const handleImageReorder = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setImages(reordered);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Trimmed basic fields
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();
  const trimmedPrice = price.trim();
  const trimmedDuration = duration.trim();
  const trimmedStartDate = startDate.trim();
  const trimmedEndDate = endDate.trim();

  if (!trimmedTitle || !trimmedPrice || !trimmedDuration || images.length === 0) {
    toast.error('Title, Price, Duration, and at least one image are required.');
    return;
  }

  // Validate price and duration
  const parsedPrice = parseFloat(trimmedPrice);
  const parsedDuration = parseInt(trimmedDuration);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    toast.error('Price must be a positive number');
    return;
  }
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    toast.error('Duration must be a positive number');
    return;
  }

  // Validate locations
  for (const loc of location) {
    if (!loc.name.trim() || !loc.lat.trim() || !loc.lng.trim()) {
      toast.error('Each location must have a name, latitude, and longitude.');
      return;
    }
  }

  // Validate included/notIncluded
  if (included.some(item => !item.trim())) {
    toast.error('Included list cannot have empty items.');
    return;
  }
  if (notIncluded.some(item => !item.trim())) {
    toast.error('Not Included list cannot have empty items.');
    return;
  }

  // Validate itinerary
  for (const day of itinerary) {
    if (!day.title.trim() || !day.description.trim()) {
      toast.error(`Itinerary day ${day.day} must have a title and description.`);
      return;
    }
    if (day.activities && day.activities.some(act => !act.trim())) {
      toast.error(`Itinerary day ${day.day} has empty activity entries.`);
      return;
    }
  }

  const formData = new FormData();
  formData.append('title', trimmedTitle);
  formData.append('description', trimmedDescription);
  formData.append('price', trimmedPrice);
  formData.append('duration', trimmedDuration);
  formData.append('startDate', trimmedStartDate);
  formData.append('endDate', trimmedEndDate);
  images.forEach((img) => formData.append("images", img));
  formData.append('category', JSON.stringify(category));
  formData.append('location', JSON.stringify(
    location.map(loc => ({
      name: loc.name.trim(),
      geo: {
        type: 'Point',
        coordinates: [parseFloat(loc.lng.trim()), parseFloat(loc.lat.trim())],
      },
    }))
  ));
  formData.append('included', JSON.stringify(included.map(i => i.trim())));
  formData.append('notIncluded', JSON.stringify(notIncluded.map(i => i.trim())));
  formData.append('itinerary', JSON.stringify(
    itinerary.map(day => ({
      day: day.day,
      title: day.title.trim(),
      description: day.description.trim(),
      activities: day.activities.map(act => act.trim()),
    }))
  ));
  setLoading(true)
  try {
    await addPackage(formData);
    navigate("/admin/packages");
    
    toast.success('Package created successfully');
    // Optionally: reset form here
  } catch (error:any) {
    toast.error( 'Failed to create package');
  }finally{
      setLoading(false)

  }
};

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-bold">Add New Package</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div>
            <Label>Duration</Label>
            <Input value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Select
            isMulti
            options={categoryOptions.map(c => ({ label: c.name, value: c._id }))}
            value={categoryOptions.filter(c => category.includes(c._id)).map(c => ({ label: c.name, value: c._id }))}
            onChange={(selected) => setCategory(selected.map(s => s.value))}
          />
        </div>

        {/* Included / Not Included */}
        {[{ label: "Included", value: included, setter: setIncluded }, { label: "Not Included", value: notIncluded, setter: setNotIncluded }].map(({ label, value, setter }) => (
          <div key={label}>
            <Label>{label}</Label>
            {value.map((val, i) => (
              <div key={i} className="flex gap-2 items-center my-1">
                <Input
                  className="flex-1"
                  value={val}
                  onChange={(e) => {
                    const updated = [...value];
                    updated[i] = e.target.value;
                    setter(updated);
                  }}
                />
                {value.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => setter(value.filter((_, idx) => idx !== i))}>✕</Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={() => setter([...value, ''])}>+ Add {label}</Button>
          </div>
        ))}
{/* Itinerary */}
<div>
  <Label>Itinerary</Label>
  {itinerary.map((item, index) => (
    <div key={index} className="border p-4 rounded-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2">
        <Input
          type="number"
          placeholder="Day"
          value={item.day}
          onChange={(e) => {
            const updated = [...itinerary];
            updated[index].day = +e.target.value;
            setItinerary(updated);
          }}
          required
        />
        <Input
          placeholder="Title"
          value={item.title}
          onChange={(e) => {
            const updated = [...itinerary];
            updated[index].title = e.target.value;
            setItinerary(updated);
          }}
          required
        />
        <Textarea
          placeholder="Description"
          value={item.description}
          onChange={(e) => {
            const updated = [...itinerary];
            updated[index].description = e.target.value;
            setItinerary(updated);
          }}
          required
        />
      </div>

      {/* Activities */}
      <div className="space-y-2 mb-2">
        <Label className="block">Activities</Label>
        {item.activities?.map((activity, actIndex) => (
          <div key={actIndex} className="flex gap-2 items-center">
            <Input
              placeholder={`Activity ${actIndex + 1}`}
              value={activity}
              onChange={(e) => {
                const updated = [...itinerary];
                updated[index].activities![actIndex] = e.target.value;
                setItinerary(updated);
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                const updated = [...itinerary];
                updated[index].activities!.splice(actIndex, 1);
                setItinerary(updated);
              }}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          onClick={() => {
            const updated = [...itinerary];
            if (!updated[index].activities) updated[index].activities = [];
            updated[index].activities.push('');
            setItinerary(updated);
          }}
        >
          + Add Activity
        </Button>
      </div>

      {/* Remove Day */}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setItinerary(itinerary.filter((_, i) => i !== index))}
      >
        Remove Day {item.day}
      </Button>
    </div>
  ))}
  <Button
    type="button"
    onClick={() =>
      setItinerary([
        ...itinerary,
        { day: itinerary.length + 1, title: '', description: '', activities: [''] },
      ])
    }
  >
    + Add Itinerary Day
  </Button>
</div>

        {/* Itinerary
        <div>
          <Label>Itinerary</Label>
          {itinerary.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center">
              <Input
                type="number"
                placeholder="Day"
                value={item.day}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[index].day = +e.target.value;
                  setItinerary(updated);
                }}
                required
              />
              <Input
                placeholder="Title"
                value={item.title}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[index].title = e.target.value;
                  setItinerary(updated);
                }}
                required
              />
              <Textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => {
                  const updated = [...itinerary];
                  updated[index].description = e.target.value;
                  setItinerary(updated);
                }}
                required

              />

              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="md:col-span-3 w-fit"
                onClick={() => setItinerary(itinerary.filter((_, i) => i !== index))}
              >
                Remove Day {item.day}
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])}>
            + Add Itinerary Day
          </Button>
        </div> */}

        {/* Locations */}
        <div>
          <Label>Locations</Label>
          {location.map((loc, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-center mb-2">
              <Input placeholder="Location Name" value={loc.name} onChange={(e) => {
                const updated = [...location];
                updated[i].name = e.target.value;
                setLocation(updated);
              }} />
              <Input type='number' placeholder="Latitude" value={loc.lat} onChange={(e) => {
                const updated = [...location];
                updated[i].lat = e.target.value;
                setLocation(updated);
              }} />
              <Input type='number' placeholder="Longitude" value={loc.lng} onChange={(e) => {
                const updated = [...location];
                updated[i].lng = e.target.value;
                setLocation(updated);
              }} />
              {location.length > 1 && (
                <Button type="button" size="sm" variant="destructive" onClick={() => setLocation(location.filter((_, idx) => idx !== i))}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={() => setLocation([...location, { name: '', lat: '', lng: '' }])}>+ Add Location</Button>
        </div>

        {/* Images */}
        <div>
          <Label>Package Images</Label>
          {/* <Input type="file" accept="image/*" onChange={handleImageChange} /> */}
          {/* {images.length < 4 && (
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

          <DragDropContext onDragEnd={handleImageReorder}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-4 mt-2">
                  {images.map((img, i) => (
                    <Draggable key={i.toString()} draggableId={i.toString()} index={i}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative">
                          <img src={URL.createObjectURL(img)} className="w-32 h-32 object-cover rounded" />
                          <button type="button" onClick={() => setImages(images.filter((_, index) => index !== i))} className="absolute top-1 right-1 bg-red-500 text-white px-1 text-xs rounded">✕</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

             <button
        type="submit"
        className="w-full bg-orange text-white py-2 rounded hover:bg-orange-dark transition mb-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? "updating..." : "Update"}
      </button>      </form>

      {showCropper && (
        <Modal onClose={() => setShowCropper(false)}>
          <div className="w-[300px] h-[300px] relative">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowCropper(false)}>Cancel</Button>
            <Button onClick={handleCropConfirm}>Crop</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddPackageForm;
