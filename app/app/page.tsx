import {requireChatGPTUser,chatGPTSignOutPath} from '../chatgpt-auth';
import CoffeeApp from './coffee-app';
export const dynamic='force-dynamic';
export default async function App(){const user=await requireChatGPTUser('/app');return <CoffeeApp displayName={user.fullName||''} signOutPath={chatGPTSignOutPath('/')}/>}
