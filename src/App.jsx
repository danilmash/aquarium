import { useState } from "react";
import AquariumCodeApp from "./AquariumCodeApp";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <AquariumCodeApp></AquariumCodeApp>
        </>
    );
}

export default App;
