function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          ¡Tailwind Activo / ta lito! 🚀
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Si ves este fondo oscuro, la tarjeta blanca con sombra y este texto con degradado, la instalación fue un éxito.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/50 transition-all">
          ¡tamo!
        </button>
      </div>
    </div>
  )
}

export default App