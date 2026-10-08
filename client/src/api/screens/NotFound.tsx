import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">That page doesn't exist.</p>
      <Link to="/" className="btn-primary mt-2">
        Back to DineFlow
      </Link>
    </div>
  );
}
