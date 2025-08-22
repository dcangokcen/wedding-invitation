import React from "react";
import PhotoUpload from "./components/PhotoUpload";
import backgroundImage from "./assets/background.png"; // Arka plan görseli

function App() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Üstte Düğün Başlığı */}
      <header className="w-full py-6 bg-black bg-opacity-40 text-center">
  <h1
    className="text-5xl md:text-6xl text-green-100 drop-shadow-lg"
    style={{ fontFamily: "'Great Vibes', cursive" }}
  >
    Nimet & Doğuş Can
  </h1>
  <div className="mt-3 mx-auto w-32 h-1 bg-green-300 rounded"></div>
</header>

      {/* Yarı saydam yükleme alanı */}
      <main className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-xl p-8 max-w-lg w-full m-6">
          <PhotoUpload />
        </div>
      </main>
    </div>
  );
}

export default App;
