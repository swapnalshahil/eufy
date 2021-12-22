import React from "react";
import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  //console.log("this",providers);
  return (
    <div className="bg-black flex flex-col items-center min-h-screen w-full justify-center">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" />

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick= {() => signIn(provider.id, {callbackUrl: '/'})}
          >
            LogIn with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
