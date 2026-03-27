import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySetupSchema, type CompanySetupFormData } from "@/schemas/CompanySetupSchema"
import { setupCompany, getCompanySetupData } from "@/services/company/companySetupService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import type { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

export default function CompanySetupPage() {
  const navigate = useNavigate()

    const {   isAuthenticated,company } = useSelector((state: RootState) => state.companyAuth);
  

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  
  useEffect(() => {
    if (isAuthenticated&&company?.isSetupComplete) {
        console.log(company,'isAuth')

      navigate('/company/dashboard');
    }
  }, [isAuthenticated, company,navigate]);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors }
  } = useForm<CompanySetupFormData>({
    resolver: zodResolver(companySetupSchema),
    mode: "onChange"
  })

  /* -------------------------
     Prefill Data
  --------------------------*/

  useEffect(() => {

    const loadData = async () => {

      try {

        const data = await getCompanySetupData()

        reset({
          name: data.name,
          email: data.email,
          phone: data.phone
        })

      } catch {
        toast.error("Failed to load user data")
      }

    }

    loadData()

  }, [reset])


  /* -------------------------
     Step Navigation
  --------------------------*/
console.log(company,'dddd');

  const handleNext = async () => {

    let valid = false

    if (step === 1)
      valid = await trigger(["name", "email", "phone"])

    if (step === 2)
      valid = await trigger(["street", "city", "state", "postalCode"])

    if (valid) setStep(step + 1)

  }

  const handleBack = () => setStep(step - 1)


  /* -------------------------
     Logo Upload
  --------------------------*/

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed")
      return
    }

    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }


  /* -------------------------
     Submit
  --------------------------*/

  const onSubmit = async (data: CompanySetupFormData) => {

    try {

      setLoading(true)

      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""))
      })

      if (logo) formData.append("logo", logo)

      await setupCompany(formData)

      toast.success("Company setup completed")
      navigate('/company/dashboard');

    } catch {

      toast.error("Setup failed")

    } finally {

      setLoading(false)

    }

  }


  /* -------------------------
     Show errors on submit
  --------------------------*/

  const onError = (errors: any) => {

    const firstError = Object.keys(errors)[0]

    const element = document.querySelector(
      `input[name="${firstError}"]`
    )

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })

    toast.error("Please fix form errors")

  }


  const inputStyle = (error?: any) =>
    `w-full border rounded-lg px-4 py-2 mt-1 transition
     ${error ? "border-red-500" : "border-gray-300"}
     focus:outline-none focus:ring-2 focus:ring-indigo-500`


  return (

    <div className="min-h-screen bg-gray-100 flex justify-center py-10">

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-semibold text-center mb-8">
          Company Setup
        </h2>


        {/* STEP PROGRESS */}

        <div className="flex justify-between mb-10">

          {["Basic Info", "Address", "Documents"].map((label, index) => {

            const stepNumber = index + 1

            return (

              <div key={label} className="flex flex-col items-center flex-1">

                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium
                  ${step >= stepNumber
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {stepNumber}
                </div>

                <p className="text-sm mt-2 text-gray-600">{label}</p>

              </div>

            )

          })}

        </div>


        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">


          {/* STEP 1 */}

          {step === 1 && (

            <div className="space-y-4">

              <div>

                <label>Company Name *</label>

                <input
                  {...register("name")}
                  placeholder="Example: Wander Travels"
                  className={inputStyle(errors.name)}
                />

                {errors.name &&
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                }

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
                  placeholder="Example: 9876543210"
                  className={inputStyle(errors.phone)}
                />

                {errors.phone &&
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                }

              </div>

            </div>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <div className="space-y-4">

              <div>

                <label>Street *</label>

                <input
                  {...register("street")}
                  placeholder="Example: MG Road"
                  className={inputStyle(errors.street)}
                />

                {errors.street &&
                  <p className="text-red-500 text-sm">{errors.street.message}</p>
                }

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label>City *</label>

                  <input
                    {...register("city")}
                    placeholder="Example: Kochi"
                    className={inputStyle(errors.city)}
                  />

                  {errors.city &&
                    <p className="text-red-500 text-sm">{errors.city.message}</p>
                  }

                </div>


                <div>

                  <label>State *</label>

                  <input
                    {...register("state")}
                    placeholder="Example: Kerala"
                    className={inputStyle(errors.state)}
                  />

                  {errors.state &&
                    <p className="text-red-500 text-sm">{errors.state.message}</p>
                  }

                </div>

              </div>


              <div>

                <label>Postal Code *</label>

                <input
                  {...register("postalCode")}
                  placeholder="Example: 676102"
                  className={inputStyle(errors.postalCode)}
                />

                {errors.postalCode &&
                  <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
                }

              </div>

            </div>

          )}


          {/* STEP 3 */}

          {step === 3 && (

            <div className="space-y-6">

              <div className="flex flex-col items-center gap-3">

                <div className="w-28 h-28 border rounded-lg overflow-hidden">

                  {logoPreview
                    ? <img src={logoPreview} className="w-full h-full object-cover" />
                    : <div className="flex items-center justify-center h-full text-gray-400">
                      Logo
                    </div>
                  }

                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />

              </div>


              <div>

                <label>GST Number</label>

                <input
                  {...register("gstNumber")}
                  placeholder="Example: 32ABCDE1234F1Z5"
                  className={inputStyle(errors.gstNumber)}
                />

                <p className="text-xs text-gray-500 mt-1">
                  Format: 32ABCDE1234F1Z5
                </p>

                {errors.gstNumber &&
                  <p className="text-red-500 text-sm">{errors.gstNumber.message}</p>
                }

              </div>


              <div>

                <label>License Number</label>

                <input
                  {...register("licenseNumber")}
                  placeholder="Example: TRAVEL12345"
                  className={inputStyle(errors.licenseNumber)}
                />

                {errors.licenseNumber &&
                  <p className="text-red-500 text-sm">{errors.licenseNumber.message}</p>
                }

              </div>

            </div>

          )}


          {/* BUTTONS */}

          <div className="flex justify-between pt-6">

            {step > 1 &&
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Back
              </button>
            }

            {step < 3 &&
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Next
              </button>
            }

            {step === 3 &&
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {loading ? "Submitting..." : "Complete Setup"}
              </button>
            }

          </div>

        </form>

      </div>

    </div>

  )

}
