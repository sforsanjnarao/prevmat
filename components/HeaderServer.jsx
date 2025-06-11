import Header from './Header'; // original header component
import { checkUser } from '@/lib/checkUser';

export default async function HeaderServer() {
  const user = await checkUser();

  return <Header user={user} />;
}