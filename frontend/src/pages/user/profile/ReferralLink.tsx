import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

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
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-2  p-4 border rounded-lg  bg-white">
      <label className="block font-medium mb-1">Your Referral Link</label>
      <div className="flex gap-2">
        <Input
          value={referralLink}
          readOnly
          className="flex-1"
        />
        <Button onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
};

export default ReferralLinkBox