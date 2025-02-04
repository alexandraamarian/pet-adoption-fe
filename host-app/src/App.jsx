import React, { Suspense, useState, useEffect } from "react";
import ReactDOM from "react-dom";

const loadRemoteComponent = async (scope, module) => {
  console.log(`Attempting to load ${scope} - ${module}`);

  if (!window[scope]) {
    throw new Error(`Remote scope ${scope} is not available.`);
  }

  await window[scope].init(__webpack_share_scopes__.default);

  const factory = await window[scope].get(module);
  return factory();
};

const LazyComponent = ({ scope, module }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    loadRemoteComponent(scope, module)
      .then((ComponentModule) => setComponent(() => ComponentModule.default))
      .catch((error) =>
        console.error(`🚨 Error loading ${module} from ${scope}`, error)
      );
  }, [scope, module]);

  if (!Component) return <div>Loading {module}...</div>;
  return <Component />;
};

const LazyStyles = ({ scope, module }) => {
  useEffect(() => {
    loadRemoteComponent(scope, module).catch((error) =>
      console.error(`Error loading ${module} from ${scope}`, error)
    );
  }, [scope, module]);

  return null;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  if (!render) return <div>Loading...</div>;

  const handleLogin = (newToken, username) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {token && (
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-purple-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          Logout
        </button>
      )}

      <Suspense fallback={<div>Loading styles...</div>}>
        <LazyStyles scope="auth" module="./styles" />
      </Suspense>
      <Suspense fallback={<div>Loading styles...</div>}>
        <LazyStyles scope="adoption" module="./styles" />
      </Suspense>

      <div className="flex items-center justify-center w-full min-h-[80vh]">
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          {token ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyComponent scope="adoption" module="./AdoptionLogic" />
            </Suspense>
          ) : (
            <Suspense fallback={<div>Loading login...</div>}>
              <LazyComponent scope="auth" module="./AuthLogic" />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
