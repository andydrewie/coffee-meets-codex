import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Coffee Meets Codex',description:'A few thoughtful connections, through the things you choose to share. Friend or Lover. Always your choice.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
