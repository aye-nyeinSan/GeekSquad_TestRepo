import Image from "next/image";
import styles from "./page.module.css";
import Login from "../app/login/page";

export default function Home() {
  return (
    <div>
      {/* Render the Login component */}
      <Login />
    </div>
  );
}
