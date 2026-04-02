import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Gift, Copy } from 'lucide-react';

type Props = {
  referralCode: string;
};

const ReferralLinkBox = ({ referralCode }: Props) => {
  const referralLink = `${window.location.origin}/signup?referral=${referralCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl border bg-gradient-to-br from-blue-50 to-white shadow-sm space-y-4">

      {/* 🎁 HEADER */}
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Gift className="w-5 h-5 text-blue-600" />
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            Refer & Earn Cashback 💸
          </h3>
          <p className="text-sm text-gray-500">
            Share your referral link with friends and earn rewards in your wallet when they sign up and book.
          </p>
        </div>
      </div>

      {/* 🔗 INPUT + BUTTON */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={referralLink}
          readOnly
          className="flex-1 text-sm"
        />

        <Button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 w-full sm:w-auto text-white"
        >
          <Copy className="w-4 h-4 text-white" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>

      {/* 💡 EXTRA NOTE */}
      <p className="text-xs text-gray-400">
        Your friend must sign up using this link for you to receive rewards.
      </p>
    </div>
  );
};

export default ReferralLinkBox;
// import { useState } from 'react';
// import { Button } from '@/components/Button';
// import { Input } from '@/components/ui/Input';
// import { toast } from 'sonner';

// type Props = {
//   referralCode: string;
// };

// const ReferralLinkBox = ({ referralCode }: Props) => {
//   const referralLink = `${window.location.origin}/signup?referral=${referralCode}`;
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(referralLink);
//       setCopied(true);
//       toast.success('Referral link copied!');
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       toast.error('Failed to copy');
//     }
//   };

//   return (
//     <div className="space-y-2  p-4 border rounded-lg  bg-white">
//       <label className="block font-medium mb-1">Your Referral Link</label>
//       <div className="flex gap-2">
//         <Input value={referralLink} readOnly className="flex-1" />
//         <Button className=' text-white' onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
//       </div>
//     </div>
//   );
// };

// export default ReferralLinkBox;
