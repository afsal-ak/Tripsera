import { useParams } from 'react-router-dom';
import AddPackageForm from '../package/AddPackageForm';

const CreateCustomPackagePage = () => {
const { userId } = useParams();
   

  if (!userId) {
    return <p className="text-red-500 text-center mt-10">No user selected for custom package.</p>;
  }

  return <AddPackageForm isCustom={true} createdFor={userId} />;
};

export default CreateCustomPackagePage;
