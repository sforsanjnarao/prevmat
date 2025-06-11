

import { getVaultPageData } from "@/actions/vaultPageData";
import SetPasswordForm from "./_components/SetPasswordForm"
import { redirect } from "next/navigation";

// this is the server component and we are fetching api here that's why we are not making this component a client 
const SetPasswordPage = async () => {
    // check if the user is already onboarded
    const {isPasswordSet} = await getVaultPageData();
    
        if(isPasswordSet){
            redirect("/data-vault");
        }
  return (
    <main>
        <div className="container mx-auto px-4 md:px-6 py-22 md:py-28 lg:py-32">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-12">
        Data Vault
      </h1>
        <p className="text-lg text-center mb-8 text-muted-foreground">
            Store and manage your sensitive information securely.
            <br />
            Your data is encrypted and only accessible by you.
        </p>
        <SetPasswordForm />

    </div>
    </main>
  )
}

export default SetPasswordPage 