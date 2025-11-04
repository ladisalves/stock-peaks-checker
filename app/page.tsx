import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Stock Tools</h1>
      <ul>
        <li>peaks checker</li>
        <li>visit <Link href="https://github.com/ladisalves/stock-peaks-checker.git">github project</Link></li>
      </ul>
    </div>
  );
}
