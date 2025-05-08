import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>Oops! Looks like you have wandered off the beaten path.</h1>
      <Link href="/">
        <button className="not-found-go-to-home">Go to Home</button>
      </Link>
    </div>
  )
}