import { getAuth } from "@clerk/nextjs/server";
import { getVaultPasswordStatus } from "@/actions/status";
import Vault from "./_components/Vault";
import { redirect } from "next/navigation";
import { getVaultPageData } from "@/actions/vaultPageData";

export default async function DataVaultPage() {
  // const { userId } = getAuth(); // ← Works here!
  // console.log("🔐 Clerk : userId =", userId);
  // // if (!userId) {
  // //   // redirect("/sign-in"); // Fallback, just in case
  // //   return null;
  // // }
  // const {isPasswordSet} = await getVaultPasswordStatus(userId);
  const { isPasswordSet } = await getVaultPageData();

    if(!isPasswordSet){
        redirect("/data-vault/setup-password");
        return null; 
    }
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-24 lg:py-32">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-5 md:mb-8  lg:mb-12">
        Data Vault
      </h1>
        <p className="text-lg text-center mb-8 text-muted-foreground">
            Store and manage your sensitive information securely.
            <br />
            Your data is encrypted and only accessible by you.
        </p>
        <Vault/>

    </div>
  );
}