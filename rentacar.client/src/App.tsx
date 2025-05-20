import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./App.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
    routeTree,
    defaultNotFoundComponent: () => <div>Page not found</div>,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function App() {
    return <RouterProvider router={router} />;
}

export default App;
