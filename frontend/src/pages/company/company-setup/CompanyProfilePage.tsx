import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  companyUpdateSchema,
 type CompanyUpdateFormData
} from "@/schemas/companyUpdateSchema"

import {
  getCompanyProfile,
  updateCompany,
  updateCompanyLogo
} from "@/services/company/companyProfileService"

import ImageCropper from "@/components/ImageCropper"
import { useImageUpload } from "@/hooks/useImageUpload"

export default function CompanyProfilePage() {

  const [loading, setLoading] = useState(false)
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CompanyUpdateFormData>({
    resolver: zodResolver(companyUpdateSchema),
    mode: "onChange"
  })

  /* -----------------------------
     IMAGE HOOK
  ------------------------------ */

  const {
    croppedImages,
    setCroppedImages,
    currentImage,
    fileInputRef,
    handleImageChange,
    handleCropComplete,
    handleCropCancel
  } = useImageUpload({ maxImages: 1 })

  const logoPreview =
    croppedImages.length > 0
      ? URL.createObjectURL(croppedImages[0])
      : companyLogo


  /* -----------------------------
     LOAD COMPANY DATA
  ------------------------------ */

  useEffect(() => {

    const loadData = async () => {

      try {

        const data = await getCompanyProfile()

        reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          description: data.description || "",
         // website: data.website || "",
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postalCode: data.address?.postalCode || "",
          gstNumber: data.gstNumber || "",
          licenseNumber: data.licenseNumber || ""
        })

        if (data.logo?.url)
          setCompanyLogo(data.logo.url)

      } catch {

        toast.error("Failed to load company")

      }

    }

    loadData()

  }, [reset])


  /* -----------------------------
     UPDATE LOGO
  ------------------------------ */

  const handleLogoUpdate = async () => {

    if (!croppedImages.length) return

    try {

      const formData = new FormData()
      formData.append("logo", croppedImages[0])

      const updated = await updateCompanyLogo(formData)

      setCompanyLogo(updated.logo.url)

      setCroppedImages([])

      toast.success("Logo updated successfully")

    } catch {

      toast.error("Logo update failed")

    }

  }


  /* -----------------------------
     UPDATE COMPANY
  ------------------------------ */

  const onSubmit = async (data: CompanyUpdateFormData) => {

    try {

      setLoading(true)

      const payload = {

        name: data.name,
        email: data.email,
        phone: data.phone,
        description: data.description,
       // website: data.website,

        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode
        },

        gstNumber: data.gstNumber,
        licenseNumber: data.licenseNumber
      }

      await updateCompany(payload)

      toast.success("Company updated successfully")

    } catch {

      toast.error("Update failed")

    } finally {

      setLoading(false)

    }

  }

  const inputStyle = (error?: any) =>
    `w-full border rounded-lg px-4 py-2 mt-1 ${
      error ? "border-red-500" : "border-gray-300"
    }`
useEffect(()=>{
    console.log(errors,'error')
})

  return (

    <div className="max-w-3xl mx-auto py-10">

      <h2 className="text-2xl font-semibold mb-8">
        Company Profile
      </h2>


      {/* -----------------------------
          LOGO SECTION
      ------------------------------ */}

      <div className="border rounded-xl p-6 mb-8">

        <h3 className="font-medium mb-4">
          Company Logo
        </h3>

        <div className="flex items-center gap-6">

          <div className="w-24 h-24 border rounded-lg overflow-hidden">

            {logoPreview
              ? (
                <img
                  src={logoPreview}
                  className="w-full h-full object-cover"
                />
              )
              : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Logo
                </div>
              )
            }

          </div>


          <div className="space-y-3">

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            {croppedImages.length > 0 && (
              <button
                onClick={handleLogoUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Update Logo
              </button>
            )}

          </div>

        </div>

      </div>


      {/* -----------------------------
          CROPPER
      ------------------------------ */}

      {currentImage && (

        <ImageCropper
          image={currentImage}
          aspect={1}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />

      )}


      {/* -----------------------------
          FORM
      ------------------------------ */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >

        <div>

          <label>Company Name</label>

          <input
            {...register("name")}
            className={inputStyle(errors.name)}
          />

          <p className="text-red-500 text-sm">
            {errors.name?.message}
          </p>

        </div>


        <div>

          <label>Email</label>

          <input
            {...register("email")}
            disabled
            className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-100"
          />

        </div>


        <div>

          <label>Phone</label>

          <input
            {...register("phone")}
            className={inputStyle(errors.phone)}
          />

          <p className="text-red-500 text-sm">
            {errors.phone?.message}
          </p>

        </div>


        <div>

          <label>Description</label>

          <textarea
            {...register("description")}
            className={inputStyle(errors.description)}
          />

        </div>


        {/* <div>

          <label>Website</label>

          <input
            {...register("website")}
            className={inputStyle(errors.website)}
          />

        </div> */}


        {/* ADDRESS */}

        <div className="grid grid-cols-2 gap-4">

          <div>

            <label>Street</label>

            <input
              {...register("street")}
              className={inputStyle(errors.street)}
            />

          </div>


          <div>

            <label>City</label>

            <input
              {...register("city")}
              className={inputStyle(errors.city)}
            />

          </div>


          <div>

            <label>State</label>

            <input
              {...register("state")}
              className={inputStyle(errors.state)}
            />

          </div>


          <div>

            <label>Postal Code</label>

            <input
              {...register("postalCode")}
              className={inputStyle(errors.postalCode)}
            />

          </div>

        </div>


        <div>

          <label>GST Number</label>

          <input
            {...register("gstNumber")}
            className={inputStyle(errors.gstNumber)}
          />

        </div>


        <div>

          <label>License Number</label>

          <input
            {...register("licenseNumber")}
            className={inputStyle(errors.licenseNumber)}
          />

        </div>


        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Updating..." : "Update Company"}
        </button>

      </form>

    </div>

  )

}