import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Strona nie znaleziona
      </h2>
      <p className="text-gray-600 mb-8">
        Przepraszamy, nie mogliśmy znaleźć strony, której szukasz.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Wróć do strony głównej
      </Link>
    </div>
  );
}
