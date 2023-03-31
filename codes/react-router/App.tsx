const React = globalThis.React;
const {
  createBrowserRouter,
  RouterProvider,
  useNavigation,
  useLoaderData,
  useLocation,
  Outlet,
  Link
} = globalThis.ReactRouterDOM

const Layout = () => {
  const navigation = useNavigation()

  return <>
    <div
      className="spinner"
      style={{
        display: navigation.state === "idle" ? "none" : "block",
      }}
    >
      Navigating...
    </div>
    <div className="wrapper">
      <div className="left">
        <div className="fixed">
          <nav>
            <ul>
              <li className="navitem">
                <Link to="/">Home</Link>
              </li>
              <li className="navitem">
                <Link to="/restore-by-key">
                  This page restores by location.key
                </Link>
              </li>
              <li className="navitem">
                <Link to="/restore-by-pathname">
                  {" "}
                  This page restores by location.pathname
                </Link>
              </li>
              <li className="navitem">
                <Link to="/link-to-hash#heading">
                  This link will link to a nested heading via hash
                </Link>
              </li>
              <li className="navitem">
                <Link to="/restore-by-key" preventScrollReset>
                  This link will not scroll to the top
                </Link>
              </li>
              <li className="navitem">
                <a href="https://www.google.com">
                  This links to an external site (google)
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="right">
        <Outlet />
      </div>
    </div>
  </>
}

const getArrayLoader = async () => {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    arr: new Array(100).fill(null).map((_, i) => i),
  };
}

const LongPage = () => {
  let data = useLoaderData();
  let location = useLocation();
  return (
    <>
      <h2>Long Page</h2>
      {data.arr.map((n) => (
        <p key={n}>
          Item {n} on {location.pathname}
        </p>
      ))}
      <h3 id="heading">This is a linkable heading</h3>
      {data.arr.map((n) => (
        <p key={n}>
          Item {n + 100} on {location.pathname}
        </p>
      ))}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => ({ element: <Layout /> }),
    children: [
      {
        index: true,
        element: <h2>Home</h2>,
      },
      {
        path: "restore-by-key",
        loader: getArrayLoader,
        element: <LongPage />,
      },
      {
        path: "restore-by-pathname",
        loader: getArrayLoader,
        element: <LongPage />,
        handle: { scrollMode: "pathname" },
      },
      {
        path: "link-to-hash",
        loader: getArrayLoader,
        element: <LongPage />,
      },
    ],
  },
], {
  basename: '/codes/react-router/'
})

const Loading = () => <span>loading...</span>

export const App = () => <RouterProvider router={router} fallbackElement={Loading} />