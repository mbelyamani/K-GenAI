// pages/index.tsx

import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  const isLoggedIn = localStorage.getItem("isLoggedIn")!=null 
                    && localStorage.getItem("isLoggedIn")=="true";
  if ( isLoggedIn ) {
    router.push('/home');
   } else {
    router.push('/login');
  }

  return (
    <div>
      This is Index Page
    </div>
  ); 
  
};

export default Index;
