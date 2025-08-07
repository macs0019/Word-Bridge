import './App.css';
import Game from './game/game';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de React Toastify


function App() {
  return (
    <div className="App">
      <Game />
      <ToastContainer
        position="top-center" // Mantiene la posición en la parte superior central
        autoClose={3000} // Tiempo de cierre automático en milisegundos
        hideProgressBar={false} // Muestra la barra de progreso
        newestOnTop={true} // Las notificaciones más recientes aparecen primero
        closeOnClick // Cierra la notificación al hacer clic
        pauseOnHover // Pausa el temporizador al pasar el mouse
        draggable // Permite arrastrar la notificación
        theme='colored'
        style={{ top: '70px', right: '100px' }} // Ajusta la posición vertical (más abajo)
      />
    </div>
  );
}

export default App;
